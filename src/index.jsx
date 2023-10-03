/* @refresh reload */
import {render} from 'solid-js/web'

import './index.css'
import App from './App'
import Footer from './Footer'

const root = document.getElementById('root')

render(() => <>
    <App/>
    <Footer/>
</>, root)
