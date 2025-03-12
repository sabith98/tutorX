import { useParams } from 'react-router-dom';

const TutorHire = () => {
  const { tutorId } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Hire Tutor Page</h1>
      <p>Tutor ID: {tutorId}</p>
    </div>
  );
};

export default TutorHire;
