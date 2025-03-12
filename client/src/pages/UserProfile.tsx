import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">User Profile Page</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default UserProfile;
