import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Card, Form } from 'react-bootstrap'

import { useAuth } from '../../contexts/AuthContext'
import CenteredContainer from '../../hoc/CenteredContainer'

const ForgotPassword = () => {
   const [error, setError] = useState('')
   const [message, setMessage] = useState('')
   const [loading, setLoading] = useState(false)

   const emailRef = useRef()

   const { resetPassword } = useAuth()

   const handleSubmit = async (e) => {
      e.preventDefault()

      try {
         setError('')
         setMessage('')
         setLoading(true)
         await resetPassword(emailRef.current.value)
         setMessage('Check your inbox for further instructions.')
      } catch (error) {
         setError(`Failed to reset password. ${error.message}`)
      }

      setLoading(false)
   }

   return (
      <CenteredContainer>
         <Card>
            <Card.Body>
               <h2 className='text-center mb-4'>Reset Password</h2>
               {error && (<Alert variant='danger'>{error}</Alert>)}
               {message && (<Alert variant='success'>{message}</Alert>)}
               <Form onSubmit={handleSubmit}>
                  <Form.Group id='email'>
                     <Form.Label htmlFor='email-input'>Email</Form.Label>
                     <Form.Control
                        type='email'
                        id='email-input'
                        ref={emailRef}
                        required
                        className='mb-3'
                     />
                  </Form.Group>
                  <Button
                     type='submit'
                     disabled={loading}
                     className='w-100'
                  >
                     Reset Password
                  </Button>
               </Form>
               <div className='w-100 text-center mt-3'>
                  <Link to='/login'>Log In</Link>
               </div>
            </Card.Body>
         </Card>
         <div className='w-100 text-center mt-2'>
            Need an account? <Link to='/signup'>Sign Up</Link>
         </div>
      </CenteredContainer>
   )
}

export default ForgotPassword
