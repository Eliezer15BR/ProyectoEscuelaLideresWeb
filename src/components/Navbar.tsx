import logo from '../assets/logo.png'
function Navbar(){
    return(
        <>
            <header className="h-20 flex justify-center items-center text-pink-950 text-4xl font-bold gap-5">
                <img src={logo} alt="Logo del club de estudio" className='h-20 w-20'/>
                Cursos
            </header>
        </>
    )
}
export default Navbar;