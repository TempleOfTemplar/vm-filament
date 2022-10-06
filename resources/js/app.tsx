import React, {useState} from 'react';
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./Pages/Auth/Register";
import FavoritedTasks from "./Pages/Task/FavoritedTasks";
import ListMyTasks from "./Pages/Task/ListMyTasks";
import ListTasks from "./Pages/Task/ListTasks";
import ViewTask from "./Pages/Task/ViewTask";
import CreateOrEditTask from "./Pages/Task/CreateOrEditTask";
import {AppShell, ColorScheme, ColorSchemeProvider, createStyles, Footer, MantineProvider} from "@mantine/core";
import AppHeader from "@/Components/AppHeader";
import {NotificationsProvider} from "@mantine/notifications";
import {Flipper} from "react-flip-toolkit";

const simultaneousAnimations = ({
                                    hideEnteringElements,
                                    animateEnteringElements,
                                    animateExitingElements,
                                    animateFlippedElements
                                }: any) => {
    hideEnteringElements();
    animateExitingElements();
    animateFlippedElements();
    animateEnteringElements();
};

const useStyles = createStyles((theme) => ({
        layout: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            main: {
                paddingTop: 24
            }
        },
    })
);

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
    const {classes, theme, cx} = useStyles();
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    const location = useLocation();

    return <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
            <NotificationsProvider><AppShell
                className={classes.layout}
                footer={
                    <Footer height={60} p="md">
                        Application footer
                    </Footer>
                }
                padding={0}
                header={
                    <AppHeader>
                    </AppHeader>
                }
            >
                <Flipper
                    flipKey={`${location.pathname}-${location.search}`}
                >
                    <Routes>
                        <Route index element={<Dashboard/>}/>
                        <Route path='login' element={<Login/>}/>
                        <Route path='register' element={<Register/>}/>
                        <Route path="tasks">
                            <Route path='' element={<ListTasks/>}/>
                            <Route path='add' element={<CreateOrEditTask/>}/>
                            <Route path=':taskId' element={<ViewTask/>}/>
                            <Route path='edit/:taskId' element={<CreateOrEditTask/>}/>
                            <Route path='favorite' element={<FavoritedTasks/>}/>
                            <Route path='my' element={<ListMyTasks/>}/>
                        </Route>
                        <Route path="*" element={<Navigate to={'tasks'}/>}/>
                    </Routes>
                </Flipper>
            </AppShell>
            </NotificationsProvider>
        </MantineProvider>
    </ColorSchemeProvider>
}

export default App;
