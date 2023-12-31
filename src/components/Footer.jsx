import solidLogo from '../assets/solid.svg'
import viteLogo from '/vite.svg'
import './Footer.css'
import {Trans} from '@mbarzda/solid-i18next';

const Footer = () => {
    return (
        <div className="footer">
            <p className="caption"><Trans key="built-info"/></p>
            <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo"/>
            </a>
            <a href="https://solidjs.com" target="_blank">
                <img src={solidLogo} className="logo solid" alt="Solid logo"/>
            </a>
        </div>
    )
}

export default Footer