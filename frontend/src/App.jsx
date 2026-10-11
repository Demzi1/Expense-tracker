import { Routes, Route, Navigate } from "react-router-dom"
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import PageNotFound from './pages/PageNotFound.jsx'
import SignUp from "./pages/Signup.jsx"
import Transaction from './pages/Transaction.jsx'
import Header from "./components/ui/Header.jsx"
import { useQuery } from "@apollo/client"
import { GET_AUTH_USER } from "./graphql/queries/user.js"
import { Toaster } from "react-hot-toast"

function App() {

  const {loading,data} = useQuery(GET_AUTH_USER);
 
  if (loading) return null;

  return (
    <>
      {data?.authUser && <Header/>}
      <Routes>
        <Route path="/" element={data.authUser? <Home/> : <Navigate to="/login"/>} />
        <Route path="/login" element={data.authUser? <Navigate to="/"/> : <Login/>}/>
        <Route path="/signup" element={data.authUser?  <Navigate to="/"/> : <SignUp/> }/>
        <Route path="/transaction/:id" element={data.authUser? <Transaction/> : <Navigate to="/login"/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
