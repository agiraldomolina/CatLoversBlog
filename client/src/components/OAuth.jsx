import {Button} from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {app} from '../firebase'
import { GoogleAuthProvider, signInWithPopup , getAuth } from 'firebase/auth'
import {useDispatch} from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice';
import{useNavigate} from'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleWithGoogle = async() => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt:'select_account' });
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider) ;
            console.log(resultFromGoogle);
           const res = await fetch('/api/auth/googleAuth', {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: resultFromGoogle.user.displayName,
                email: resultFromGoogle.user.email,
                googlePhotoUrl: resultFromGoogle.user.photoURL,
            }),
           })
           const data = await res.json();
           console.log(data);
           dispatch
           if(res.ok){
            dispatch(signInSuccess(data));
            navigate('/');
           }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Button
        type='button'
        gradientDuoTone='purpleToPink'
        outline={true} 
        onClick={handleWithGoogle}       
    ><AiFillGoogleCircle
        className='w-6 h-6 mr-2'
    />
        Continue with Google
    </Button>
  )
}

