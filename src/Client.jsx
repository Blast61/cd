import { useQuery } from "@tanstack/react-query";
import fetchClient from "./fetchClient";

const Client = () => {
  // const { id } = useParams();
  const results = useQuery(["clients"]);
  return (
    <div>
      <h1>{results.firstName}</h1>
      <h1>{results.lastName}</h1>
      <h2>{results.eventType}</h2>
      <h3>{results.eventDate}</h3>
    </div>
  );
};

export default Client;
