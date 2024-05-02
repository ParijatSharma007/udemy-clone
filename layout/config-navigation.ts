import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import TocIcon from "@mui/icons-material/Toc";
import ListAltIcon from '@mui/icons-material/ListAlt';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import NotesIcon from '@mui/icons-material/Notes';

export interface NavItem {
  title: string;
  path: string | null;
  icon: React.ElementType | null; // Use React.ElementType to represent the type of the icon
  children: NavItem[];
  hasChild: boolean;
}

const navConfig: NavItem[] = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
    children: [],
    hasChild: false
  },
  
      {
        title: "Teacher List",
        path: "/admin/teacherList",
        icon: ListAltIcon,
        children: [],
        hasChild: true
      },
   {
        title: "Video List",
        path: "/admin/videoList",
        icon: VideoLibraryIcon,
        children: [],
        hasChild: true
      },
       {
        title: "Student Details",
        path: "/admin/studentDetails",
        icon: GroupAddIcon,
        children: [],
        hasChild: true
      },
       {
        title: "History",
        path: "/admin/history",
        icon: WorkHistoryIcon,
        children: [],
        hasChild: true
      },
       {
        title: "Notes",
        path: "/admin/notes",
        icon: NotesIcon,
        children: [],
        hasChild: true
      },

];

export default navConfig;
