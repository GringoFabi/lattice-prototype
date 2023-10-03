import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './Footer.css'

function Footer() {


    return (
        <div class="footer">
            <p class="caption">Built with</p>
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