'use client';

import Link from "next/link";
import "lumir-internal-design-system-nextjs/index.css"
import LUMIR_LOGO_1 from "~/icons/h_logo-1.png";
import {MenuCategory, MenuItem} from "lumir-internal-design-system-nextjs/src/types/menuItems";
import {usePathname, useSearchParams} from "next/navigation";
import {
  SidebarBottomSection, SidebarCategory,
  SidebarFavorite,
  SidebarHeader, SidebarItem,
  SidebarLogo,
  SidebarProvider, SidebarToggle, SidebarUpperSection
} from "lumir-internal-design-system-nextjs/src/components";

interface SidebarStructure {
  Logo: React.FC;
  SidebarUpperSection: React.FC;
  SidebarLowerSection: React.FC;
}
const favorites: MenuItem[] = [
  {
    name: '전체 면접 일정',
    path: '/calendar',
    icon: 'FiPieChart',
  }
]

const menuItems: {
  main: MenuCategory[];
  config: MenuCategory[];
} = {main: [
    {
      category: '나의 면접 일정',
      icon: 'FiPieChart',
      items: [
        { name: '서면평가', path: '/', icon: 'FiPieChart' },
        { name: '대면평가', path: '/dashboard/employees', icon: 'FiBarChart2' },
        { name: '입사 후 1차 평가', path: '/dashboard/employees', icon: 'FiBarChart2' },
        { name: '입사 후 2차 평가', path: '/dashboard/employees', icon: 'FiBarChart2' },
      ]
    },
    {
      category: '인사 관리',
      icon: 'FiCalendar',
      items: [
        { name: '지원자 관리', path: '/attendance', icon: 'FiClock' },
        { name: '채용 포지션 관리', path: '/attendance', icon: 'FiClock' },
        { name: '지원자 신규 추가', path: '/attendance', icon: 'FiClock' },
      ]
    },
    {
      category: '관리자',
      icon: 'FiSettings',
      items: [
        { name: '사용자 관리', path: '/management/files', icon: 'FiHome' },
      ]
    },
    {
      category: '외부 링크',
      icon: 'FiSettings',
      items: [
        { name: '루미르', path: 'https://www.google.com', icon: 'FiHome' },
        { name: '사람인', path: 'https://www.google.com', icon: 'FiHome' },
        { name: '잡코리아', path: 'https://www.google.com', icon: 'FiHome' },
        { name: '점핏', path: 'https://www.google.com', icon: 'FiHome' },
        { name: '프로그래머스', path: 'https://www.google.com', icon: 'FiHome' },
      ]
    }
  ],
  config: [
    {
      category: '설정',
      icon: 'FiSettings',
      items: [
        { name: '일반 설정', path: '/settings/users', icon: 'FiSettings' },
        { name: '근태 설정', path: '/settings', icon: 'FiTool' },
      ]
    },
  ]}
const Sidebar = () => {

  const pathname = usePathname();
  console.log(pathname);
  
  return (

      <SidebarProvider currentPath={pathname}>
        <SidebarHeader className="flex items-center gap-4 justify-between">
          <SidebarLogo src={LUMIR_LOGO_1}  />
          <SidebarToggle />
          
        </SidebarHeader>
        <SidebarFavorite
          name="전체 면접 일정"
          path="/calendar"
          icon="FiPieChart"
          LinkComponent={Link}
          className={"mt-4"}
        />
        <SidebarUpperSection>
          
          {menuItems.main.map((category, categoryIndex) => (
            <SidebarCategory key={categoryIndex} title={category.category} index={categoryIndex}>
              {category.items.map((item, itemIndex) => (
                <SidebarItem
                  key={itemIndex}
                  name={item.name}
                  path={item.path}
                  icon={item.icon}
                  LinkComponent={Link}
                />
              ))}
            </SidebarCategory>
          ))}
        </SidebarUpperSection>
        <SidebarBottomSection>
          user
        </SidebarBottomSection>
      </SidebarProvider>
    
  );
}

export default Sidebar;