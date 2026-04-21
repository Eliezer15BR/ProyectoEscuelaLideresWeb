import Accordion from "../components/Accordion";
import Navbar from "../components/Navbar";

function Pendientes(){
    return(
    <>
        <div className="md:ml-70 ml-42">
            <Navbar titulo="Pendientes"/>
            <main>
            <Accordion></Accordion>
            </main>
        </div>
    </>
    );
}
export default Pendientes;