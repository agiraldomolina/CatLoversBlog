import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch} from'react-icons/ai'
import { FaMoon, FaSun} from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from '../redux/theme/themeSlice';
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice'
export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const {theme} = useSelector((state) => state.theme);
    const path = useLocation().pathname;

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
    <>
    <Navbar className='border-b-2'>
        <Link to="/"
            className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span
                className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 rounded-lg text-white'
            >  CatLover's  </span>
            Blog
        </Link>
        <form >
            <TextInput
                type='text'
                placeholder='Search...'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
            ></TextInput>
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button  
                className='w-12 h-10 hidden sm:inline' 
                color='gray' 
                pill
                onClick={()=>dispatch(changeTheme())}
            >
                {theme === 'light'? <FaMoon /> : <FaSun />}
            </Button>
            {
                currentUser? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label=  {
                            <Avatar
                            alt='user'
                            img={currentUser.avatar}
                            rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                        </Dropdown.Header>
                           <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                           </Link>
                           <Dropdown.Divider/>
                           <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                    </Dropdown>

                ):
                (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )
            }
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path ==="/"} as={'div'}>
                <Link to='/'>
                    Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path ==="/about"} as={'div'}>
                <Link to='/about'>
                    About
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path ==="/dashboard"} as={'div'} >
                <Link to='/dashboard'>
                    TimeLine
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>    
    </>
  )
}
