export { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort } from "@fortawesome/free-solid-svg-icons/faSort";
import { faSortUp } from "@fortawesome/free-solid-svg-icons/faSortUp";
import { faSortDown } from "@fortawesome/free-solid-svg-icons/faSortDown";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons/faMinusSquare";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import { faStream } from "@fortawesome/free-solid-svg-icons/faStream";

const iconsUsed = [
  faSort,
  faSortUp,
  faSortDown,
  faPlusSquare,
  faMinusSquare,
  faEllipsisH,
  faAngleLeft,
  faAngleRight,
  faSpinner,
  faTimesCircle,
  faStream,
];
library.add(...iconsUsed);
