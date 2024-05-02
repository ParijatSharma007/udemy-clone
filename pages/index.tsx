import StorySec from "@/components/StorySec/StorySec";
import assest from "@/json/assest";
import { cardList } from "@/json/mock/cardlist.mock";
import Wrapper from "@/layout/wrapper/Wrapper";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Wrapper>
      <StorySec cardList={cardList} image={assest?.story_img} title="Our Story">
        <Typography>
          Dr. Mitchell Schwartz founded Procell Therapies in 2013 with a bold
          vision. During his 30+ years as a practicing dermatologist he had
          observed the limitations and damage caused by other anti-aging
          systems. Dr. Schwartz realized that with some engineering and
          ingenuity he could provide better results in a safe and non-invasive
          way. Thanks to our roots in dermatology practice, we know what it
          takes to successfully adopt a new treatment technology. That’s why
          Procell Therapies provides trainings, marketing materials, and a
          lifetime guarantee for all of our products.
        </Typography>
      </StorySec>
    </Wrapper>
  );
}
