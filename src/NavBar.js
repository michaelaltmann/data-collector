import React from 'react'
import {
    Link
} from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

const NavBar = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" component={Link} to="/">Data Collector</Button>
                    <Button color="inherit" component={Link} to="/study">Studies</Button>
                    <Button color="inherit" component={Link} to="/observation">Observations</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}
export default NavBar;