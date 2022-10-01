import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./Pages/Auth/Register";
import CommonLayout from "./Layouts/CommonLayout";

function App() {
    //Getting isAuthenticated store value from Authentication reducer.
    // const {isAuthenticated, validateUserLoader} = useSelector(state => state.authenticateReducer)

    // const {userInfo: user} = useSelector((state) => state.user);
    //const dispatch = useDispatch();

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         dispatch({
    //             type: actions.GET_AUTH_USER,
    //         });
    //     }
    // }, [])

    // if (validateUserLoader) {
    //     return <Spinner/>;
    // }
    return <Routes>
        <Route path="/" element={<CommonLayout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='login' element={<Login/>}/>
            <Route path='register' element={<Register/>}/>
        </Route>
    </Routes>
}

export default App;
