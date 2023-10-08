interface Props {
  name: string;
  bio: string;
  description: string;
  image: string;
  url: string;
}

const FeaturePremiere = ({ name, bio, description, image, url }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",

        marginBottom: "20px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        style={{ flexGrow: 0, margin: "5px", width: "120px", height: "120px" }}
        src={image}
        alt={name}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginLeft: "10px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "30px" }}>{name}</div>
        <div>{bio}</div>
        <div>{description}</div>
        <a href={url}>Watch {name}&apos;s session here</a>
      </div>
    </div>
  );
};

export default FeaturePremiere;
