import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import {BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin} from'react-icons/bs'

export default function Component() {
  return (
    <Footer
        container
        className='border border-t-8 border-orange-400 flex justify-between items-center py-4'
    >
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between">
                <div className="mt-5">
                <Link to="/"
                    className='self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white'>
                    <span
                        className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 rounded-lg text-white'
                    >  CatLover's  </span>
                    Blog
                </Link>
                </div>
                <div 
                    className=""
                >
                    <div className="gap-1">
                        <Footer.Title title='Legal'/>
                        <Footer.LinkGroup col className='m-0 p-0'>
                            <Footer.Link
                                href='#'
                            >
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link
                                href='#'
                            >
                                Terms & Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider/>
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright 
                    href='#' 
                    by="Alba's blog" 
                    year={new Date().getFullYear()}
                />
                <div className="flex gap-3 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href='#'icon={BsFacebook} />
                    <Footer.Icon href='#'icon={BsInstagram} />
                    <Footer.Icon href='#'icon={BsTwitter} />
                    <Footer.Icon href='https://www.github.com/agiraldomolina'icon={BsGithub} />
                    <Footer.Icon href='https://linkedin.com/in/alba-giraldo-6086a046/'icon={BsLinkedin} />
                </div>
            </div>
        </div>
    </Footer>
  )
}
