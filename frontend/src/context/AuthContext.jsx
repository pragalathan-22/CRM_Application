// import React, { createContext, useReducer, useEffect, useState } from 'react'

// export const AuthContext = createContext()

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return { user: action.payload }
//     case 'LOGOUT':
//       localStorage.removeItem('token')
//       return { user: null }
//     default:
//       return state
//   }
// }

// export const AuthContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, { user: null })
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       dispatch({ type: 'LOGIN', payload: token })
//     }
//     setLoading(false)
//   }, [])

//   // Prevent blank screen during initial auth check
//   if (loading) return <div>Loading...</div>

//   return (
//     <AuthContext.Provider value={{ ...state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

import React, { createContext, useReducer, useEffect, useState } from 'react'

export const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      localStorage.removeItem('token')
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch({ type: 'LOGIN', payload: token })
    }
    setLoading(false)
  }, [])

  // Prevent blank screen during initial auth check
  if (loading) return <div>Loading...</div>

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
} 