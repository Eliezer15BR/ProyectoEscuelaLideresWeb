import logo from '../assets/logo.png'
function Login(){
    return(
    <div className='flex justify-center w-screen h-screen items-center bg-linear-to-b from-blue-300 to-blue-200'>
        <div className="bg-linear-to-b from-pink-950 to-pink-800 text-gray-500 w-96 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
            >
            <img src={logo} className='h-30 w-30 m-auto'/>
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                Iniciar sesión
            </h2>
            <form>
                <label htmlFor="email" className="block w-full mb-1 font-medium text-white">Correo</label>
                <input id="email" className="bg-white w-full text-black border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="email" placeholder="ejemplo@gmail.com" required />
                <label htmlFor="password" className="block w-full mb-1 font-medium text-white">Contraseña</label>
                <input id="password" className="bg-white w-full text-black border border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="password" placeholder="·········" required />
                <p className="text-right my-4">
                    <button className="text-white cursor-pointer hover:text-indigo-200"
                        onClick={()=>console.log("Solicita cambio")}
                    >
                        Olvidaste tu Contraseña?
                    </button>
                </p>
                <button type="submit" className="btn-animated w-full mb-3 bg-secondary py-2.5 rounded-full text-white cursor-pointer btn-animated">
                    Ingresar
                </button>
            </form>
        </div>
    </div>
    );
}
export default Login;