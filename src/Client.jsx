const Client = (props) => {
  return (
    <div>
      <h1>{props.firstName}</h1>
      <h1>{props.lastName}</h1>
      <h2>{props.eventType}</h2>
      <h3>{props.eventDate}</h3>
    </div>
  );
};

export default Client;
