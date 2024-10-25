import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Table from '../components/table.jsx';
import PieChart from '../components/PieChart.jsx';
import Chart from '../components/chart.jsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const user = {
  name: 'Tom Ancien',
  email: 'tom@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear user session (localStorage, state management, etc.)
    localStorage.removeItem('token'); // or however you manage user sessions
    navigate('/'); // Redirect to login page
  }

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-[#373A40] ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  alt="Your Company"
                  src="../public/logo.png"  // Consider checking this path
                  className="w-40"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {/* Add navigation items here if needed */}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative mr-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img alt="" src={user.imageUrl} className="h-8 w-8 rounded-full" />
                    </MenuButton>
                  </div>
                  <Menu.Items
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        <a
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          {item.name}
                        </a>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>

                <button
                  type="button"
                  className="relative p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={handleLogout} // Attach click handler
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.name}</div>
                <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <main className='flex flex-col'>

<div className='flex flex-row justify-around mx-12 my-6'>
<div className='bg-white w-96 rounded-md mr-12'>
<div>
      <h1 className="font-semibold ml-6 mt-6">
          Topology
      </h1>
  </div>
<img 
className='mt-12 my-6 ml-8'
src="../../public/topology.png" alt="topology" />
</div>

   <Table />
    
</div>

<div className='flex flex-col mx-12 my-6 md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-6'>
<div className='bg-white rounded-md shadow flex-1 '>
<PieChart />
</div>
<div className='bg-white rounded-md shadow flex-1'>
<Chart />
</div>
<div className='flex flex-col justify-between'>
      < div className='bg-[#3EA0A3] rounded-md px-4 py-4 text-center'>
          <h1 className='text-2xl font-semibold'>Max Bandwith Offer</h1> 
          <p className='text-3xl font-bold'>10 Mbps</p>
      </div>
      < div className='bg-white rounded-md px-4 py-4 text-center'>
          <h1 className='text-2xl font-semibold'>Client's Number</h1>
          <p className='text-3xl font-bold'> 2</p>
      </div>
      < div className='bg-[#C7F5C7] rounded-md px-4 py-4 text-center'>
          <h1 className='text-2xl font-semibold'>Online Client's Number</h1> 
          <p className='text-3xl font-bold'> 2</p>
      </div>
</div>


</div>


</main>
    </div>
  );
}
