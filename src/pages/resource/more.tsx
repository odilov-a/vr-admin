import { useHooks } from "hooks";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t } = useHooks();
  if (!data) {
    return <p>{t("Loading...")}</p>;
  }

  const normalLinks = data.resources.filter(
    (resource: string) =>
      !resource.includes("youtube.com") && !resource.includes("youtu.be")
  );

  const youtubeLinks = data.resources.filter(
    (resource: string) =>
      resource.includes("youtube.com") || resource.includes("youtu.be")
  );

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be")) {
      const videoId = url
        .split("/")
        .pop()
        ?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div>
      <div className="flex">
        <div className="mr-[30px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Resource title")}:</p>
            <b>{data.title}</b>
          </div>
        </div>
      </div>
      <div className="mb-[10px]">
        {normalLinks.map((resource: string, index: number) => (
          <div key={index} className="flex items-center">
            <span className="mr-2">{index + 1}.</span>
            <a
              href={resource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {t("Open Resource")}
            </a>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {youtubeLinks.map((resource: string, index: number) => (
          <div key={index} className="flex flex-col items-start">
            <span className="mb-1">
              {index + 1}. {t("YouTube Video")}
            </span>
            <iframe
              width="200"
              height="150"
              src={getYouTubeEmbedUrl(resource)}
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default More;
