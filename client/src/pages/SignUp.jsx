import { Button, Label, TextInput} from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'> 
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
      {/* left side */}
        <div className="flex-1">
        <Link to="/"
            className='font-bold dark:text-white text-4xl'>
            <span
                className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 rounded-lg text-white'
            >  CatLover's  </span>
            Blog
        </Link>
        <p className='text-sm mt-5'>
          This a demo project. You can sign up with your email and password <br />or with Google
        </p>

        </div>
      {/* right side */}
        <div className="flex-1">
        <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='User name'
                id='username'
              />
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='text'
                placeholder='Email'
                id='email'
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
              />
            </div>
            <Button gradientDuoTone='pinkToOrange' type='submit'>
              Sign Up
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sig-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
