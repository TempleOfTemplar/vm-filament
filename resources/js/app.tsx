import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./Pages/Auth/Register";
import CommonLayout from "./Layouts/CommonLayout";
import FavoritedTasks from "./Pages/Task/FavoritedTasks";
import ListMyTasks from "./Pages/Task/ListMyTasks";
import ListTasks from "./Pages/Task/ListTasks";
import ViewTask from "./Pages/Task/ViewTask";

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
            <Route path="tasks">
                <Route path='' element={<ListTasks/>}/>
                <Route path=':id' element={<ViewTask/>}/>
                <Route path='favorite' element={<FavoritedTasks/>}/>
                <Route path='my' element={<ListMyTasks/>}/>
            </Route>
            <Route path="*" element={<Navigate to={'tasks'}/>}/>
        </Route>
    </Routes>
}

export default App;
