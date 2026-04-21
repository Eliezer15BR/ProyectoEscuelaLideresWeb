import Accordion from "../components/Accordion";
import Navbar from "../components/Navbar";

function Pendientes(){
    return(
    <>
        <div className="ml-70">
            <Navbar titulo="Pendientes"/>
            <main>
            <Accordion></Accordion>
            </main>
        </div>
    </>
    );
}
export default Pendientes;