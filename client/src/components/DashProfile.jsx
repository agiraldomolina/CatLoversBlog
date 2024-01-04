import { Alert, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { HiInformationCircle, HiXCircle } from 'react-icons/hi'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart, updateSuccess, updateFailure} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function DashProfile() {
  const {currentUser} = useSelector(state => state.user)
  // Pieces of states
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [ imageUploadError, setImageUploadError ] = useState(null)
  const [ imageFileUploading, setImageFileUploading ] = useState(false)
  const [ updateUserSuccess, setUpdateUserSuccess ] = useState(null)
  const [ updateuserError, setUpdateuserError ] = useState(null)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  // create a reference to the file input element
  const filePickerRef = useRef()

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    setImageFile(file)
    setImageFileUrl(URL.createObjectURL(file)) // this create a temprary url for the file
  }
};
useEffect(() => {
  if(imageFile){
    uploadImage()
  }
}, [imageFile]);

const uploadImage = async () => {
  setImageFileUploading(true)
  setImageUploadError(null)
  const storage = getStorage(app)
  const fileName =new Date().getTime()+ imageFile.name
  const storageRef = ref(storage, fileName)
  const uploadTask = uploadBytesResumable(storageRef, imageFile)
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress =  (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // This is saved is a piece of state: imageUploadProgress
      setImageFileUploadProgress(progress.toFixed(0)) // toFixed(0) is used to round the number to 0 decimal places
    },
    ()=>{
      setImageUploadError('Error uploading image, file must be less than 2MB');
      setImageFileUploadProgress(null)
      setImageFileUrl(null)
      setImageFile(null)
      setImageFileUploading(false)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) => {
        setImageFileUrl(downLoadURL)
        setFormData({...formData, profilePicture: downLoadURL })
        setImageFileUploading(false)
        setUpdateuserError(null)
      });
    }
  )
}

const handleChange = (event) => {
  setFormData({...formData, [event.target.id]: event.target.value })
}
//console.log(formData)

const handleSubmit = async (event) => {
  event.preventDefault();
  setUpdateUserSuccess(null)
  setUpdateuserError(null)
  if (Object.keys(formData).length === 0) {
    setUpdateuserError('No changes made')
    return
  }
  if(imageFileUploading){
    setUpdateuserError('Please wait while image is uploading')
    return;
  }
  try {
    dispatch(updateStart());
    //console.log('current user from dashboard profile: ' +  currentUser._id)
    const response = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if(!response.ok) {
      dispatch(updateFailure(data.message));
      setUpdateuserError(data.message);
    }else{
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User's profile updated successfully")
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
    setUpdateuserError(error.message);
  }
}

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1
        className='my-7 text-center text-3xl font-semibold '
      >
        Profile
      </h1>
      <form 
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <input 
          type="file"
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef} 
          hidden
        />
        <div 
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={()=> filePickerRef.current.click()} // clicking on the file input element will trigger the file picker
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.avatar}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {imageUploadError && (
          <Alert
            color='failure'
            icon={HiInformationCircle}
            rounded
          >
            {imageUploadError}
          </Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert
          color='success'
          icon={HiInformationCircle}
          rounded
        >
          {updateUserSuccess}
        </Alert>
      )}
      {updateuserError && (
        <Alert
          color='failure'
          icon={HiXCircle}
          rounded
        >
          {updateuserError}
        </Alert>
      )}
    </div>
  )
}
