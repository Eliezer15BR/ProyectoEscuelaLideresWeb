import logoImage from '../images/logo.png'
interface LogoProps{
    className?: string;
}
export const LogoInst=({className = ''}:LogoProps)=>{
    return (
        <>
            <div className={`${className} w-30`}>
                <img src={logoImage} alt="Logo de SOCEIQAPP" />
            </div>
        </>
    );
}