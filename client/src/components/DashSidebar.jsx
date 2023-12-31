import {Sidebar} from 'flowbite-react'
import { useEffect, useState } from 'react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice';

export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl){
      setTab(tabFromUrl)
    }
  }, [location.search]);

  const handleSignOut = async () => {
    dispatch(signOutStart());
    try {
      const response = await fetch('/api/user/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      !response.ok? dispatch(signOutFailure(data.message)) : dispatch(signOutSuccess())
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }


  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item
                        active={tab === 'profile'}
                        icon={ HiUser }
                        label= {"User"}
                        labelColor = 'dark'
                        as='div'
                    >
                        Profile
                    </Sidebar.Item>
                </Link>
                <Sidebar.Item
                    icon={ HiArrowSmRight }
                    className='cursor-pointer'
                    onClick = {handleSignOut}
                >
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
