import { useEffect } from "react";
import { useCourseStore } from "./hooks/useCourseStore"
import { Button } from "../../components/Button";
import { CourseCard } from "./components/CourseCard";
import { useNavigate } from "react-router-dom";

export const CourseListScreen = () => {
    const { courses, isLoading, error, fetchCourses } = useCourseStore();
    const navigate = useNavigate();
    useEffect(() => {
        fetchCourses();
    },[]);
    if (isLoading){
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-text-secondary font-medium">Cargando tus clases...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20 max-w-md text-center">
                    <p className="font-bold mb-2">¡Ups! Algo salió mal</p>
                    <p className="text-sm">{error}</p>
                </div>
                <Button onClick={fetchCourses} variant="secondary">
                Intentar de nuevo
                </Button>
            </div>
        );
    }
    if (courses.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <p className="text-text-secondary font-medium text-lg">Aún no hay cursos registrados.</p>
        </div>
        );
    }
    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
        <div className="flex justify-between items-end">
            <div>
            <h1 className="text-2xl font-extrabold text-primary-dark">Mis Clases</h1>
            <p className="text-sm text-text-secondary mt-1">Explora los cursos en los que estás inscrito</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
            <CourseCard 
                key={course.id_curso} 
                course={course} 
                onClick={(id) => navigate(`/clases/${id}`)} 
            />
            ))}
        </div>
        </div>
    );
}