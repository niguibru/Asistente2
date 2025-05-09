import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  //BoxCubeIcon,
  RobotIcon,
  ChevronDownIcon,
  HorizontaLDots,
  WFIcon,
  TasksIcon,
  PortfolioIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
//import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean, disabled?: boolean }[];
  disabled?: boolean; // Nueva propiedad para deshabilitar
};

const navItems: NavItem[] = [
  {
    icon: <RobotIcon />,
    name: "Copilot",
    path: "/", //this is Home.tsx
    //subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <WFIcon />,
    name: "Workflows",
    path: "/workflows",
  },
  {
    icon: <TasksIcon />,
    name: "Tareas - WIP",
    path: "/tasks",
    disabled: true, // Este ítem estará deshabilitado
  },
  {
    name: "Tu Cartera",
    icon: <PortfolioIcon />,
    path: "/your-portfolio",
  },
  /*  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },*/
];

const othersItems: NavItem[] = [];
/* const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
]; */

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
  //   <ul className="flex flex-col gap-4">
  //     {items.map((nav, index) => (
  //       <li key={nav.name}>
  //         {nav.subItems ? (
  //           <button
  //             onClick={() => handleSubmenuToggle(index, menuType)}
  //             className={`menu-item group ${
  //               openSubmenu?.type === menuType && openSubmenu?.index === index
  //                 ? "menu-item-active"
  //                 : "menu-item-inactive"
  //             } cursor-pointer ${
  //               !isExpanded && !isHovered
  //                 ? "lg:justify-center"
  //                 : "lg:justify-start"
  //             }`}
  //           >
  //             <span
  //               className={`menu-item-icon-size  ${
  //                 openSubmenu?.type === menuType && openSubmenu?.index === index
  //                   ? "menu-item-icon-active"
  //                   : "menu-item-icon-inactive"
  //               }`}
  //             >
  //               {nav.icon}
  //             </span>
  //             {(isExpanded || isHovered || isMobileOpen) && (
  //               <span className="menu-item-text">{nav.name}</span>
  //             )}
  //             {(isExpanded || isHovered || isMobileOpen) && (
  //               <ChevronDownIcon
  //                 className={`ml-auto w-5 h-5 transition-transform duration-200 ${
  //                   openSubmenu?.type === menuType &&
  //                   openSubmenu?.index === index
  //                     ? "rotate-180 text-brand-500"
  //                     : ""
  //                 }`}
  //               />
  //             )}
  //           </button>
  //         ) : (
  //           nav.path && (
  //             <Link
  //               to={nav.path}
  //               className={`menu-item group ${
  //                 isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
  //               }`}
  //             >
  //               <span
  //                 className={`menu-item-icon-size ${
  //                   isActive(nav.path)
  //                     ? "menu-item-icon-active"
  //                     : "menu-item-icon-inactive"
  //                 }`}
  //               >
  //                 {nav.icon}
  //               </span>
  //               {(isExpanded || isHovered || isMobileOpen) && (
  //                 <span className="menu-item-text">{nav.name}</span>
  //               )}
  //             </Link>
  //           )
  //         )}
  //         {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
  //           <div
  //             ref={(el) => {
  //               subMenuRefs.current[`${menuType}-${index}`] = el;
  //             }}
  //             className="overflow-hidden transition-all duration-300"
  //             style={{
  //               height:
  //                 openSubmenu?.type === menuType && openSubmenu?.index === index
  //                   ? `${subMenuHeight[`${menuType}-${index}`]}px`
  //                   : "0px",
  //             }}
  //           >
  //             <ul className="mt-2 space-y-1 ml-9">
  //               {nav.subItems.map((subItem) => (
  //                 <li key={subItem.name}>
  //                   <Link
  //                     to={subItem.path}
  //                     className={`menu-dropdown-item ${
  //                       isActive(subItem.path)
  //                         ? "menu-dropdown-item-active"
  //                         : "menu-dropdown-item-inactive"
  //                     }`}
  //                   >
  //                     {subItem.name}
  //                     <span className="flex items-center gap-1 ml-auto">
  //                       {subItem.new && (
  //                         <span
  //                           className={`ml-auto ${
  //                             isActive(subItem.path)
  //                               ? "menu-dropdown-badge-active"
  //                               : "menu-dropdown-badge-inactive"
  //                           } menu-dropdown-badge`}
  //                         >
  //                           new
  //                         </span>
  //                       )}
  //                       {subItem.pro && (
  //                         <span
  //                           className={`ml-auto ${
  //                             isActive(subItem.path)
  //                               ? "menu-dropdown-badge-active"
  //                               : "menu-dropdown-badge-inactive"
  //                           } menu-dropdown-badge`}
  //                         >
  //                           pro
  //                         </span>
  //                       )}
  //                     </span>
  //                   </Link>
  //                 </li>
  //               ))}
  //             </ul>
  //           </div>
  //         )}
  //       </li>
  //     ))}
  //   </ul>
  // );

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => {
                if (!nav.disabled) { // Solo permitir toggle si no está deshabilitado
                  handleSubmenuToggle(index, menuType);
                }
              }}
              disabled={nav.disabled} // Añadir el atributo disabled al botón
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } ${nav.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${ // Estilos para deshabilitado
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                } ${nav.disabled ? 'opacity-50' : ''}`} // Opacidad para el icono si está deshabilitado
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text ${nav.disabled ? 'opacity-50' : ''}`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  } ${nav.disabled ? 'opacity-50' : ''}`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              nav.disabled ? ( // Si el ítem está deshabilitado
                <div // Renderizar un div en lugar de Link
                  className={`menu-item group menu-item-inactive opacity-50 cursor-not-allowed ${ // Clases para apariencia deshabilitada
                    !isExpanded && !isHovered // Mantener clases de layout si es necesario
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size menu-item-icon-inactive`} // Usar estilo de icono inactivo o específico para deshabilitado
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </div>
              ) : ( // Si el ítem está habilitado
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  } ${ // No es necesario añadir clases de disabled aquí si se cambia el tag
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )
          )}
          {/* Lógica para subItems deshabilitados */}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index && !nav.disabled // No expandir si el padre está deshabilitado
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    {subItem.disabled ? (
                       <div // Renderizar div si el subItem está deshabilitado
                        className={`menu-dropdown-item menu-dropdown-item-inactive opacity-50 cursor-not-allowed`}
                      >
                        {subItem.name}
                        {/* Badges también podrían necesitar estilos de deshabilitado */}
                      </div>
                    ) : (
                      <Link
                        to={subItem.path}
                        onClick={(e) => { if (nav.disabled) e.preventDefault(); }} // Prevenir navegación si el padre está deshabilitado
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        } ${nav.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`} // Estilos si el padre está deshabilitado
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`
        fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 
        bg-[#3B3B3B] dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all 
        duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/Zinco-Logo.png"
                alt="Logo"
                width={180}
                height={48}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/Zinco-Logo.png"
                alt="Logo"
                width={180}
                height={48}
              />
            </>
          ) : (
            <img
              src="/images/logo/Zinco-Icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  // "Others"
                  <></>
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
