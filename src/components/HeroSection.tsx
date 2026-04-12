"use client";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { toast } from "sonner";
import styles from "@/app/page.module.scss";
import { heroContent } from "@/data/homeContent";
import { ArrowCorner } from "./ArrowCorner";

gsap.registerPlugin(ScrambleTextPlugin);

type ResourceIconKey =
  | "scribe"
  | "studyArcade"
  | "voxMeet"
  | "cliefNotes"
  | "substack";

function ResourceIcon({ icon }: { icon: ResourceIconKey }) {
  switch (icon) {
    case "scribe":
      return (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={styles.resourceSvg}
        >
          <g>
            <path
              className={`${styles.resourceNode} ${styles.resourceScribeNodeRight}`}
              d="M29.3134 24.2723C31.3757 25.6492 34.5094 24.4856 36.3126 21.6734C38.1158 18.8611 37.9058 15.4651 35.8434 14.0883C33.7811 12.7114 30.6475 13.875 28.8442 16.6872C27.041 19.4995 27.2511 22.8955 29.3134 24.2723Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceLink} ${styles.resourceScribeLinkUpper}`}
              d="M5.58795 6.15543L32.9094 19.075"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceScribeNodeTopLeft}`}
              d="M2.21428 11.1261C4.27661 12.503 7.41026 11.3394 9.21347 8.52717C11.0167 5.71491 10.8066 2.31894 8.74431 0.942049C6.68198 -0.434838 3.54834 0.72876 1.74512 3.54102C-0.0580962 6.35328 0.151956 9.74925 2.21428 11.1261Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceLink} ${styles.resourceScribeLinkLower}`}
              d="M5.58795 32.2211L33.3536 16.8084"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceScribeNodeBottomLeft}`}
              d="M8.74408 37.4185C6.68176 38.7954 3.54811 37.6318 1.7449 34.8195C-0.0583182 32.0073 0.151736 28.6113 2.21406 27.2344C4.27639 25.8575 7.41004 27.0211 9.21325 29.8334C11.0165 32.6456 10.8064 36.0416 8.74408 37.4185Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceScribeNodeRightEcho}`}
              d="M29.597 24.4502C27.4626 23.1928 27.0674 19.8141 28.7141 16.9036C30.3609 13.9931 33.4261 12.6531 35.5604 13.9105C37.6948 15.1679 38.09 18.5466 36.4433 21.4571C34.7965 24.3676 31.7313 25.7076 29.597 24.4502Z"
              fill="#5D3136"
            />
          </g>
          <defs>
            <clipPath id="clip0_669_6">
              <rect width="38" height="38" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case "studyArcade":
      return (
        <svg
          width="42"
          height="44"
          viewBox="0 0 42 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={styles.resourceSvg}
        >
          <path
            className={`${styles.resourceLink} ${styles.resourceStudyArcadeLink}`}
            d="M7.43927 7.9191L34.796 36.2357"
            stroke="#E9D6CD"
            strokeWidth="10.2"
            strokeLinecap="round"
          />
          <path
            className={`${styles.resourceNode} ${styles.resourceStudyArcadeNodeTl}`}
            d="M4.03421 13.4218C6.26223 14.8796 9.64765 13.6476 11.5957 10.6702C13.5438 7.69274 13.3169 4.09728 11.0889 2.63952C8.86086 1.18175 5.47544 2.4137 3.52735 5.39115C1.57925 8.3686 1.80618 11.9641 4.03421 13.4218Z"
            fill="#5D3136"
          />
          <path
            className={`${styles.resourceNode} ${styles.resourceStudyArcadeNodeTr}`}
            d="M37.9657 13.4218C35.7377 14.8796 32.3523 13.6476 30.4042 10.6702C28.4561 7.69273 28.683 4.09728 30.911 2.63952C33.1391 1.18175 36.5245 2.4137 38.4726 5.39115C40.4207 8.3686 40.1938 11.9641 37.9657 13.4218Z"
            fill="#5D3136"
          />
          <path
            className={`${styles.resourceNode} ${styles.resourceStudyArcadeNodeBl}`}
            d="M11.0889 41.2586C8.86087 42.7163 5.47545 41.4844 3.52735 38.5069C1.57926 35.5295 1.80619 31.934 4.03422 30.4762C6.26225 29.0185 9.64766 30.2504 11.5958 33.2279C13.5439 36.2053 13.3169 39.8008 11.0889 41.2586Z"
            fill="#5D3136"
          />
          <path
            className={`${styles.resourceNode} ${styles.resourceStudyArcadeNodeBr}`}
            d="M30.911 41.2585C33.139 42.7163 36.5244 41.4844 38.4725 38.5069C40.4206 35.5295 40.1937 31.934 37.9657 30.4762C35.7376 29.0185 32.3522 30.2504 30.4041 33.2279C28.456 36.2053 28.6829 39.8008 30.911 41.2585Z"
            fill="#5D3136"
          />
        </svg>
      );
    case "voxMeet":
      return (
        <svg
          width="50"
          height="45"
          viewBox="0 0 50 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={styles.resourceSvg}
        >
          <g>
            <path
              className={`${styles.resourceLink} ${styles.resourceVoxBarTall}`}
              d="M36.125 7.91205V35.3571"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceLink} ${styles.resourceVoxBarMid}`}
              d="M22.375 17.0604V38.2005"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceVoxNodeMidBottom}`}
              d="M25.7029 42.0158C23.3817 43.5178 19.8548 42.2485 17.8253 39.1807C15.7958 36.1129 16.0322 32.4084 18.3534 30.9064C20.6745 29.4044 24.2014 30.6737 26.2309 33.7415C28.2604 36.8093 28.024 40.5138 25.7029 42.0158Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceVoxNodeMidTop}`}
              d="M18.3533 23.7191C20.6744 25.2211 24.2013 23.9518 26.2308 20.884C28.2603 17.8162 28.0239 14.1116 25.7028 12.6097C23.3817 11.1077 19.8548 12.377 17.8252 15.4448C15.7957 18.5126 16.0321 22.2171 18.3533 23.7191Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceVoxNodeTallBottom}`}
              d="M32.3533 42.0158C34.6744 43.5178 38.2013 42.2485 40.2308 39.1807C42.2603 36.1129 42.0239 32.4083 39.7028 30.9063C37.3817 29.4043 33.8548 30.6737 31.8252 33.7415C29.7957 36.8093 30.0321 40.5138 32.3533 42.0158Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceVoxNodeTallTop}`}
              d="M32.3533 13.829C34.6744 15.331 38.2013 14.0617 40.2308 10.9939C42.2603 7.92608 42.0239 4.22154 39.7028 2.71954C37.3817 1.21755 33.8548 2.48687 31.8252 5.55467C29.7957 8.62246 30.0321 12.327 32.3533 13.829Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceVoxNodeSmallBottom}`}
              d="M4.20265 42.0158C6.52379 43.5178 10.0507 42.2485 12.0802 39.1807C14.1097 36.1129 13.8733 32.4083 11.5522 30.9063C9.23102 29.4043 5.70412 30.6737 3.67461 33.7415C1.6451 36.8093 1.88152 40.5138 4.20265 42.0158Z"
              fill="#5D3136"
            />
          </g>
          <defs>
            <clipPath id="clip0_669_31">
              <rect width="50" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case "cliefNotes":
      return (
        <svg
          width="44"
          height="35"
          viewBox="0 0 44 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={styles.resourceSvg}
        >
          <g>
            <path
              className={`${styles.resourceLink} ${styles.resourceCliefStem}`}
              d="M37.6539 5.41666L16.4998 28.7501"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceLink} ${styles.resourceCliefTail}`}
              d="M20.3075 28.7501L7.19214 16.0418"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceCliefNodeTop}`}
              d="M31.9417 3.71071C30.6566 5.64499 31.7426 8.58407 34.3673 10.2753C36.9919 11.9666 40.1614 11.7696 41.4464 9.83528C42.7315 7.90099 41.6455 4.96192 39.0208 3.27066C36.3961 1.57941 33.2267 1.77642 31.9417 3.71071Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceCliefNodeCenter}`}
              d="M16.6715 32.5355C18.6355 33.8011 21.6198 32.7316 23.3371 30.1467C25.0544 27.5618 24.8544 24.4404 22.8903 23.1748C20.9263 21.9092 17.942 22.9787 16.2247 25.5636C14.5074 28.1485 14.7075 31.27 16.6715 32.5355Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceCliefNodeLeft}`}
              d="M2.32643 19.2103C1.04139 17.276 2.12737 14.3369 4.75204 12.6457C7.3767 10.9544 10.5461 11.1514 11.8312 13.0857C13.1162 15.02 12.0302 17.9591 9.40558 19.6503C6.78091 21.3416 3.61147 21.1446 2.32643 19.2103Z"
              fill="#5D3136"
            />
          </g>
          <defs>
            <clipPath id="clip0_669_43">
              <rect width="44" height="35" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case "substack":
      return (
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={styles.resourceSvg}
        >
          <g>
            <path
              className={`${styles.resourceLink} ${styles.resourceSubstackLineTop}`}
              d="M29.4309 6.38239H4.08606"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceLink} ${styles.resourceSubstackLineBottom}`}
              d="M29.4309 28.6177H4.08606"
              stroke="#E9D6CD"
              strokeWidth="10.2"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceSubstackNodeTr}`}
              d="M28.4958 0.936954C26.3111 1.40425 25.0348 4.20541 25.6449 7.19354C26.255 10.1817 28.5206 12.2252 30.7052 11.7579C32.8898 11.2906 34.1662 8.48945 33.5561 5.50133C32.9459 2.5132 30.6804 0.469662 28.4958 0.936954Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceSubstackNodeBr}`}
              d="M28.4958 23.1722C26.3111 23.6395 25.0348 26.4407 25.6449 29.4288C26.255 32.417 28.5206 34.4605 30.7052 33.9932C32.8898 33.5259 34.1662 30.7247 33.5561 27.7366C32.9459 24.7485 30.6804 22.705 28.4958 23.1722Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceSubstackNodeTl}`}
              d="M3.95549 11.7578C1.77087 11.2906 0.494481 8.48939 1.10459 5.50127C1.7147 2.51314 3.98027 0.469601 6.16489 0.936889C8.3495 1.40418 9.62589 4.20534 9.01578 7.19347C8.40567 10.1816 6.1401 12.2251 3.95549 11.7578Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceSubstackNodeBl}`}
              d="M3.95549 33.9931C1.77087 33.5258 0.494481 30.7247 1.10459 27.7366C1.7147 24.7484 3.98027 22.7049 6.16489 23.1722C8.3495 23.6395 9.62589 26.4406 9.01578 29.4288C8.40567 32.4169 6.1401 34.4604 3.95549 33.9931Z"
              fill="#5D3136"
            />
            <path
              className={`${styles.resourceNode} ${styles.resourceSubstackNodeCenter}`}
              d="M15.9899 22.2816C14.0466 21.866 12.9112 19.3742 13.4539 16.7162C13.9966 14.0582 16.012 12.2404 17.9552 12.6561C19.8985 13.0717 21.0339 15.5634 20.4912 18.2215C19.9485 20.8795 17.9332 22.6973 15.9899 22.2816Z"
              fill="#5D3136"
            />
          </g>
          <defs>
            <clipPath id="clip0_669_50">
              <rect width="35" height="35" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
  }
}

export function HeroSection() {
  const scrambleLabel = (text: HTMLElement | null, activeColor: string) => {
    if (!text) return;

    if (!text.dataset.originalLabel) {
      text.dataset.originalLabel = text.textContent || "";
    }

    gsap.killTweensOf(text);
    gsap.to(text, {
      color: activeColor,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to(text, {
      duration: 0.8,
      scrambleText: {
        text: text.dataset.originalLabel || "",
        chars: "upperCase",
        revealDelay: 0,
        speed: 0.8,
      },
    });
  };

  const resetScrambleLabel = (
    text: HTMLElement | null,
    restingColor: string,
  ) => {
    if (!text) return;

    gsap.killTweensOf(text);
    text.textContent = text.dataset.originalLabel || text.textContent || "";
    gsap.to(text, {
      color: restingColor,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const showToast = (message: string) => {
    toast.custom(
      (id) => (
        <button
          type="button"
          className={styles.edubaToastCard}
          onClick={() => toast.dismiss(id)}
        >
          {message}
        </button>
      ),
      {
      id: "hero-resource-toast",
        duration: 1400,
        dismissible: true,
      },
    );
  };

  const handleResourceClick = (comingSoon?: boolean) => {
    if (comingSoon) {
      showToast("Vox Meet is coming soon.");
    }
  };

  const handleResourceEnter = (card: HTMLElement) => {
    const text = card.querySelector(`.${styles.resourceTitle}`) as
      | HTMLElement
      | null;

    gsap.killTweensOf(card);
    gsap.to(card, {
      backgroundColor: "#ead5d678",
      borderColor: "#5D3136",
      duration: 0.2,
      ease: "power2.out",
    });

    scrambleLabel(text, "#4A2C2A");
  };

  const handleResourceLeave = (card: HTMLElement) => {
    const text = card.querySelector(`.${styles.resourceTitle}`) as
      | HTMLElement
      | null;

    gsap.killTweensOf(card);
    gsap.to(card, {
      backgroundColor: "transparent",
      borderColor: "#D8BFC0",
      duration: 0.2,
      ease: "power2.out",
    });

    resetScrambleLabel(text, "#5D3136");
  };

  const handleReadingEnter = (card: HTMLElement) => {
    const text = card.querySelector(`.${styles.readingTitle}`) as
      | HTMLElement
      | null;

    scrambleLabel(text, "#5D3136");
  };

  const handleReadingLeave = (card: HTMLElement) => {
    const text = card.querySelector(`.${styles.readingTitle}`) as
      | HTMLElement
      | null;

    resetScrambleLabel(text, "#4A2C2A");
  };

  return (
    <div className={styles.content}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <div className={styles.navArrowLeft}>
            <ArrowCorner />
          </div>
          <div className={styles.navArrowRight}>
            <ArrowCorner mirror />
          </div>
          <svg
            width="1406"
            height="313"
            viewBox="0 0 1406 313"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="fillGradient"
                x1="799"
                y1="312.5"
                x2="796"
                y2="0.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#492526" />
                <stop offset="1" stopColor="#5D4143" />
              </linearGradient>
              <linearGradient
                id="strokeGradient"
                x1="721"
                y1="0.5"
                x2="712.5"
                y2="312.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F3C3C5" />
                <stop offset="1" stopColor="#8D7172" />
              </linearGradient>
            </defs>
            <path
              d="M6.18178 305.297C2.39393 305.297 0.5 303.402 0.5 299.611V6.18651C0.5 2.3955 2.39393 0.5 6.18178 0.5H211.483C215.271 0.5 217.165 2.3955 217.165 6.18651V50.9204C217.165 54.7114 215.271 56.6069 211.483 56.6069H72.0904C69.5652 56.6069 68.3026 57.8706 68.3026 60.3979V116.505C68.3026 119.032 69.5652 120.296 72.0904 120.296H205.044C208.832 120.296 210.726 122.191 210.726 125.982V171.095C210.726 174.886 208.832 176.782 205.044 176.782H72.0904C69.5652 176.782 68.3026 178.046 68.3026 180.573V245.02C68.3026 247.547 69.5652 248.811 72.0904 248.811H217.544C221.332 248.811 223.226 250.707 223.226 254.498V299.611C223.226 303.402 221.332 305.297 217.544 305.297H6.18178Z"
              fill="url(#fillGradient)"
              stroke="url(#strokeGradient)"
            />
            <path
              d="M262.528 305.297C258.74 305.297 256.846 303.402 256.846 299.611V6.18651C256.846 2.3955 258.74 0.5 262.528 0.5H364.8C417.324 0.5 457.728 13.7685 486.011 40.3056C514.293 66.5899 528.435 104.247 528.435 153.278C528.435 200.792 514.293 238.07 486.011 265.112C457.728 291.902 418.461 305.297 368.209 305.297H262.528ZM324.648 245.02C324.648 247.547 325.911 248.811 328.436 248.811H364.042C427.425 248.811 459.117 216.84 459.117 152.899C459.117 88.7041 427.299 56.6069 363.663 56.6069H328.436C325.911 56.6069 324.648 57.8706 324.648 60.3979V245.02Z"
              fill="url(#fillGradient)"
              stroke="url(#strokeGradient)"
            />
            <path
              d="M774.545 279.518C752.828 301.506 722.272 312.5 682.879 312.5C643.485 312.5 612.803 301.506 590.834 279.518C568.864 257.278 557.879 226.318 557.879 186.639V6.18651C557.879 2.3955 559.773 0.5 563.561 0.5H620C623.788 0.5 625.682 2.3955 625.682 6.18651V179.056C625.682 230.614 644.747 256.393 682.879 256.393C720.757 256.393 739.696 230.614 739.696 179.056V6.18651C739.696 2.3955 741.59 0.5 745.378 0.5H801.817C805.605 0.5 807.499 2.3955 807.499 6.18651V186.639C807.499 226.318 796.514 257.278 774.545 279.518Z"
              fill="url(#fillGradient)"
              stroke="url(#strokeGradient)"
            />
            <path
              d="M858.818 305.297C855.03 305.297 853.137 303.402 853.137 299.611V6.18651C853.137 2.3955 855.03 0.5 858.818 0.5H982.681C1016.27 0.5 1042.28 7.57655 1060.71 21.7296C1079.4 35.63 1088.74 55.3433 1088.74 80.8694C1088.74 107.406 1076.24 127.625 1051.24 141.525C1048.46 143.042 1048.46 144.685 1051.24 146.454C1081.8 161.618 1097.07 184.869 1097.07 216.208C1097.07 244.515 1086.47 266.502 1065.26 282.172C1044.04 297.589 1014.25 305.297 975.863 305.297H858.818ZM920.56 115.368C920.56 117.895 921.823 119.159 924.348 119.159H976.62C1005.41 119.159 1019.8 108.291 1019.8 86.5559C1019.8 76.1938 1016.39 68.6118 1009.57 63.8098C1002.76 59.0079 992.024 56.6069 977.378 56.6069H924.348C921.823 56.6069 920.56 57.8706 920.56 60.3979V115.368ZM920.56 245.02C920.56 247.547 921.823 248.811 924.348 248.811H978.514C995.686 248.811 1008.19 245.778 1016.01 239.713C1024.09 233.647 1028.14 224.169 1028.14 211.28C1028.14 198.391 1024.22 189.039 1016.39 183.227C1008.56 177.414 995.812 174.507 978.136 174.507H924.348C921.823 174.507 920.56 175.771 920.56 178.298V245.02Z"
              fill="url(#fillGradient)"
              stroke="url(#strokeGradient)"
            />
            <path
              d="M1338.27 305.297C1334.98 305.297 1332.84 303.781 1331.83 300.748L1304.17 227.202C1303.42 225.18 1302.03 224.17 1300.01 224.17H1193.19C1191.17 224.17 1189.78 225.18 1189.02 227.202L1161.37 300.748C1160.36 303.781 1158.22 305.297 1154.93 305.297H1095.46C1090.92 305.297 1089.4 303.149 1090.92 298.852L1210.24 5.0492C1211.25 2.0164 1213.52 0.5 1217.05 0.5H1278.42C1281.95 0.5 1284.23 2.0164 1285.24 5.0492L1404.93 298.852C1406.45 303.149 1404.93 305.297 1400.39 305.297H1338.27ZM1212.89 163.513C1212.13 166.546 1213.14 168.063 1215.92 168.063H1277.28C1280.06 168.063 1281.07 166.546 1280.31 163.513L1249.25 80.1112C1248.24 77.5838 1247.23 76.1938 1246.22 75.9411C1245.97 75.9411 1245.72 76.1938 1245.46 76.6993L1244.33 80.1112L1212.89 163.513Z"
              fill="url(#fillGradient)"
              stroke="url(#strokeGradient)"
            />
          </svg>
        </h1>
      </section>

      <section className={styles.readings}>
        {heroContent.readings.map((reading) => (
          <a
            key={reading.title}
            className={styles.readingCard}
            href={reading.href}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(event) => handleReadingEnter(event.currentTarget)}
            onMouseLeave={(event) => handleReadingLeave(event.currentTarget)}
            onFocus={(event) => handleReadingEnter(event.currentTarget)}
            onBlur={(event) => handleReadingLeave(event.currentTarget)}
          >
            <div className={styles.bookmarkIcon}>
              <ArrowCorner mirror />
            </div>
            <h3 className={styles.readingTitle}>{reading.title}</h3>
          </a>
        ))}
      </section>

      <section className={styles.resources}>
        <div className={styles.resourcesHeader}>
          <span className={styles.resourcesTitle}>
            {heroContent.resourcesLabel}
          </span>
        </div>
        <div className={styles.resourcesGrid}>
          {heroContent.resources.map((resource) => {
            const isComingSoon =
              "comingSoon" in resource && resource.comingSoon === true;

            const cardContent = (
              <>
                <div className={styles.resourceIcon}>
                  <ResourceIcon icon={resource.icon} />
                </div>
                <span className={styles.resourceTitle}>{resource.title}</span>
              </>
            );

            if (isComingSoon) {
              return (
                <button
                  key={resource.title}
                  type="button"
                  className={styles.resourceCard}
                  onClick={() => handleResourceClick(isComingSoon)}
                  onMouseEnter={(event) =>
                    handleResourceEnter(event.currentTarget)
                  }
                  onMouseLeave={(event) =>
                    handleResourceLeave(event.currentTarget)
                  }
                  onFocus={(event) =>
                    handleResourceEnter(event.currentTarget)
                  }
                  onBlur={(event) =>
                    handleResourceLeave(event.currentTarget)
                  }
                >
                  {cardContent}
                </button>
              );
            }

            return (
              <a
                key={resource.title}
                className={styles.resourceCard}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(event) =>
                  handleResourceEnter(event.currentTarget)
                }
                onMouseLeave={(event) =>
                  handleResourceLeave(event.currentTarget)
                }
                onFocus={(event) => handleResourceEnter(event.currentTarget)}
                onBlur={(event) => handleResourceLeave(event.currentTarget)}
              >
                {cardContent}
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
