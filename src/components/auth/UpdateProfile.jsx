import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Form } from 'react-bootstrap'

import { useAuth } from '../../contexts/AuthContext'
import CenteredContainer from '../../hoc/CenteredContainer'

const UpdateProfile = () => {
   const [error, setError] = useState('')
   const [message, setMessage] = useState('')
   const [loading, setLoading] = useState(false)

   const emailRef = useRef()
   const passwordRef = useRef()
   const passwordConfirmRef = useRef()

   const { currentUser, updateUserEmail, updateUserPassword } = useAuth()
   const navigate = useNavigate()

   const handleSubmit = (e) => {
      e.preventDefault()

      if (passwordRef.current.value !== passwordConfirmRef.current.value)
         return setError('Passwords do not match.')

      setError('')
      setMessage('')
      setLoading(true)

      const promises = []
      if (emailRef.current.value !== currentUser.email) {
         setMessage('Email updated successfully. Redirecting you shortly.')
         promises.push(updateUserEmail(emailRef.current.value))
      }
      else if (passwordRef.current.value) {
         setMessage('Password updated successfully. Redirecting you shortly.')
         promises.push(updateUserPassword(passwordRef.current.value))
      }

      Promise.all(promises).then(() => {
         setTimeout(() => { navigate('/user') }, 2000)
      }).catch((error) => {
         setError(`Failed to update account. ${error.message}`)
      }).finally(() => {
         setLoading(false)
      })
   }

   return (
      <CenteredContainer>
         <Card>
            <Card.Body>
               <h2 className='text-center mb-4'>Update Profile</h2>
               {error && (<Alert variant='danger'>{error}</Alert>)}
               {!loading && !error && message && (<Alert variant='success'>{message}</Alert>)}
               <Form onSubmit={handleSubmit}>
                  <Form.Group id='email'>
                     <Form.Label htmlFor='email-input'>Email</Form.Label>
                     <Form.Control
                        type='email'
                        id='email-input'
                        ref={emailRef}
                        defaultValue={currentUser.email}
                        required
                        className='mb-3'
                     />
                  </Form.Group>
                  <Form.Group id='password'>
                     <Form.Label htmlFor='password-input'>Password</Form.Label>
                     <Form.Control
                        type='password'
                        id='password-input'
                        ref={passwordRef}
                        placeholder='Leave blank to keep the same'
                        className='mb-3'
                     />
                  </Form.Group>
                  <Form.Group id='password-confirm'>
                     <Form.Label htmlFor='password-conf-input'>Password Confirmation</Form.Label>
                     <Form.Control
                        type='password'
                        id='password-conf-input'
                        ref={passwordConfirmRef}
                        placeholder='Leave blank to keep the same'
                        className='mb-3'
                     />
                  </Form.Group>
                  <Button
                     type='submit'
                     disabled={loading}
                     className='w-100'
                  >
                     Update
                  </Button>
               </Form>
            </Card.Body>
         </Card>
         <div className='w-100 text-center mt-2'>
            <Link to='/user'>Cancel</Link>
         </div>
      </CenteredContainer>
   )
}

export default UpdateProfile
