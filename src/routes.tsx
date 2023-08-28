import { Icon } from './lib/chakra';
import {
  MdFileCopy,
  MdHome,
  MdLock,
  MdLayers,
  MdAutoAwesome,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { LuHistory } from 'react-icons/lu';
import { RoundedChart } from '@/components/icons/Icons';

// Auth Imports
import { IRoute } from './types/navigation';

const routes: IRoute[] = [
  {
    name: 'Chat UI',
    path: '/',
    icon: (
      <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },
  {
    name: 'Chats',
    path: '/chats/',
    icon: (
      <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },
  {
    name: 'My Projects',
    disabled: false,
    path: '/my-projects',
    icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Other Pages',
    disabled: false,
    path: '/others',
    icon: <Icon as={MdFileCopy} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Prompt Page',
        layout: '/others',
        path: '/prompt',
      },
      {
        name: 'Register',
        layout: '/others',
        path: '/register',
      },
      {
        name: 'Sign In',
        layout: '/others',
        path: '/Login',
      },
    ],
  },
  // --- Admin Pages ---
  {
    name: 'Admin Pages',
    disabled: true,
    path: '/admin',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'All Templates',
        layout: '/admin',
        path: '/all-admin-templates',
      },
      {
        name: 'New Template',
        layout: '/admin',
        path: '/new-template',
      },
      {
        name: 'Edit Template',
        layout: '/admin',
        path: '/edit-template',
      },
      {
        name: 'Users Overview',
        layout: '/admin',
        path: '/overview',
      },
    ],
  },
  {
    name: 'Profile Settings',
    disabled: true,
    path: '/settings',
    icon: (
      <Icon
        as={MdOutlineManageAccounts}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    invisible: true,
    collapse: false,
  },
  {
    name: 'History',
    disabled: true,
    path: '/history',
    icon: <Icon as={LuHistory} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Usage',
    disabled: true,
    path: '/usage',
    icon: <Icon as={RoundedChart} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'My plan',
    disabled: true,
    path: '/my-plan',
    icon: <Icon as={RoundedChart} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  }
]

export default routes;
