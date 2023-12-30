import { Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from'react-icons/fa'
import {HiMail} from'react-icons/hi'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const navigate = useNavigate();
  const [forData, setFormData] = useState({});
  const [ loading, setLoading ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ showPassword, setShowPassword ] = useState(true);

  const handleChange= (event) => {
    setFormData({...forData, [event.target.id]: event.target.value.trim()})
  }
  console.log(forData)
  const handleSubmit = async(event) => {
    event.preventDefault()
    if (!forData.email ||!forData.password ||!forData.username) return setErrorMessage('Please fill all out the fields')
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch ('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(forData)
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage('Invalid information')
      }
      setLoading(false);
      if(res.ok) navigate('/sign-in');  
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }
  

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
          <form 
            className='flex flex-col gap-4'
            onSubmit={handleSubmit}>
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div className='mb-2 block'>
              <Label value='Your Email' />
              <TextInput
                type='email'
                rightIcon={HiMail}
                placeholder='Email'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your username' />
              <div onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <TextInput
                  type="text"
                  placeholder="Password"
                  id="password"
                  rightIcon={FaEye}
                  onChange={handleChange}
                />
              ) : (
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  rightIcon={FaEyeSlash}
                  onChange={handleChange}
                />
              )}
            </div>
            </div>
            <Button 
              gradientDuoTone='pinkToOrange'  
              type='submit'
              disabled={loading}
            >
              {
                loading? (
                  <>
                    <Spinner size='sm'/>
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : (
                  'Sign Up'
                )
              }
            </Button>
            <OAuth/>
              
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
