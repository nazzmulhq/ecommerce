import type {
    Alert,
    Anchor,
    AutoComplete,
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Calendar,
    Card,
    Carousel,
    Cascader,
    Checkbox,
    Col,
    Collapse,
    ColorPicker,
    DatePicker,
    Descriptions,
    Divider,
    Drawer,
    Dropdown,
    Empty,
    Flex,
    FloatButton,
    Form,
    GetProps,
    Image,
    Input,
    InputNumber,
    Layout,
    List,
    Mentions,
    Menu,
    Modal,
    Pagination,
    Popconfirm,
    Popover,
    Progress,
    QRCode,
    Radio,
    Rate,
    Result,
    Row,
    Segmented,
    Select,
    Skeleton,
    Slider,
    Space,
    Spin,
    Statistic,
    Steps,
    Switch,
    Table,
    Tabs,
    Tag,
    Timeline,
    TimePicker,
    Tooltip,
    Tour,
    Transfer,
    Tree,
    TreeSelect,
    Typography,
    Upload,
    Watermark,
} from "antd";

// Generic component type for all UI components
export type TBasicUI = {
    ctype: keyof ComponentTypeMap;
};

// General Types
export const BUTTON = "button";
export type TButton = GetProps<typeof Button>;

export const FLOAT_BUTTON = "float_button";
export type TFloatButton = GetProps<typeof FloatButton> & TBasicUI;

export const FLOAT_BUTTON_BACK_TOP = "float_button.back_top";
export type TFloatButtonBackTop = GetProps<typeof FloatButton.BackTop> & TBasicUI;

export const FLOAT_BUTTON_GROUP = "float_button.group";
export type TFloatButtonGroup = GetProps<typeof FloatButton.Group> & TBasicUI;

export const TYPOGRAPHY_TITLE = "typography.title";
export type TTypographyTitle = GetProps<typeof Typography.Title> & TBasicUI;

export const TYPOGRAPHY_TEXT = "typography.text";
export type TTypographyText = GetProps<typeof Typography.Text> & TBasicUI;

export const TYPOGRAPHY_LINK = "typography.link";
export type TTypographyLink = GetProps<typeof Typography.Link> & TBasicUI;

export const TYPOGRAPHY_PARAGRAPH = "typography.paragraph";
export type TTypographyParagraph = GetProps<typeof Typography.Paragraph> & TBasicUI;

// Layout Types
export const DIVIDER = "divider";
export type TDivider = GetProps<typeof Divider> & TBasicUI;

export const GRID_ROW = "grid.row";
export type TGridRow = GetProps<typeof Row> & TBasicUI;

export const GRID_COL = "grid.col";
export type TGridCol = GetProps<typeof Col> & TBasicUI;

export const FLEX = "flex";
export type TFlex = GetProps<typeof Flex> & TBasicUI;

export const SPACE = "space";
export type TSpace = GetProps<typeof Space> & TBasicUI;

export const SPACE_COMPACT = "space.compact";
export type TSpaceCompact = GetProps<typeof Space.Compact> & TBasicUI;

export const LAYOUT = "layout";
export type TLayout = GetProps<typeof Layout> & TBasicUI;

export const HEADER = "layout.header";
export type THeader = GetProps<typeof Layout.Header> & TBasicUI;

export const SIDER = "layout.sider";
export type TSider = GetProps<typeof Layout.Sider> & TBasicUI;

export const CONTENT = "layout.content";
export type TContent = GetProps<typeof Layout.Content> & TBasicUI;

export const FOOTER = "layout.footer";
export type TFooter = GetProps<typeof Layout.Footer> & TBasicUI;

// Navigation
export const ANCHOR = "anchor";
export type TAnchor = GetProps<typeof Anchor> & TBasicUI;

export const DROPDOWN = "dropdown";
export type TDropdown = GetProps<typeof Dropdown> & TBasicUI;

export const MENU = "menu";
export type TMenu = GetProps<typeof Menu> & TBasicUI;

export const STEPS = "steps";
export type TSteps = GetProps<typeof Steps> & TBasicUI;

export const PAGINATION = "pagination";
export type TPagination = GetProps<typeof Pagination> & TBasicUI;

export const BREADCRUMB = "breadcrumb";
export type TBreadcrumb = GetProps<typeof Breadcrumb> & TBasicUI;

// Data Entry
export const AUTO_COMPLETE = "auto_complete";
export type TAutoComplete = GetProps<typeof AutoComplete> & TBasicUI;

export const CASCADER = "cascader";
export type TCascader = GetProps<typeof Cascader> & TBasicUI;

export const CHECKBOX = "checkbox";
export type TCheckbox = GetProps<typeof Checkbox> & TBasicUI;

export const CHECKBOX_GROUP = "checkbox_group";
export type TCheckboxGroup = GetProps<typeof Checkbox.Group> & TBasicUI;

export const COLOR_PICKER = "color_picker";
export type TColorPicker = GetProps<typeof ColorPicker> & TBasicUI;

export const DATE_PICKER = "date_picker";
export type TDatePicker = GetProps<typeof DatePicker> & TBasicUI;

export const DATE_PICKER_RANGE = "date_picker_range";
export type TDatePickerRange = GetProps<typeof DatePicker.RangePicker> & TBasicUI;

export const FORM = "form";
export type TForm = GetProps<typeof Form> & TBasicUI;

export const FORM_ITEM = "form.item";
export type TFormItem = GetProps<typeof Form.Item> & TBasicUI;

export const FROM_LIST = "from.list";
export type TFormList = GetProps<typeof Form.List> & TBasicUI;

export const FORM_PROVIDER = "form.provider";
export type TFormProvider = GetProps<typeof Form.Provider> & TBasicUI;

export const INPUT = "input";
export type TInput = GetProps<typeof Input> & TBasicUI;

export const INPUT_PASSWORD = "input.password";
export type TInputPassword = GetProps<typeof Input.Password> & TBasicUI;

export const INPUT_SEARCH = "input.search";
export type TInputSearch = GetProps<typeof Input.Search> & TBasicUI;

export const INPUT_TEXT_AREA = "input.text_area";
export type TInputTextArea = GetProps<typeof Input.TextArea> & TBasicUI;

export const INPUT_OTP = "input.otp";
export type TInputOTP = GetProps<typeof Input.OTP> & TBasicUI;

export const INPUT_GROUP = "input_group";
export type TInputGroup = GetProps<typeof Input.Group> & TBasicUI;

export const INPUT_NUMBER = "input_number";
export type TInputNumber = GetProps<typeof InputNumber> & TBasicUI;

export const MENTION = "mention";
export type TMention = GetProps<typeof Mentions> & TBasicUI;

export const RATE = "rate";
export type TRate = GetProps<typeof Rate> & TBasicUI;

export const RADIO = "radio";
export type TRadio = GetProps<typeof Radio> & TBasicUI;

export const RADIO_BUTTON = "radio.button";
export type TRadioButton = GetProps<typeof Radio.Button> & TBasicUI;

export const RADIO_GROUP = "radio.group";
export type TRadioGroup = GetProps<typeof Radio.Group> & TBasicUI;

export const SELECT = "select";
export type TSelect = GetProps<typeof Select> & TBasicUI;

export const SLIDER = "slider";
export type TSlider = GetProps<typeof Slider> & TBasicUI;

export const SWITCH = "switch";
export type TSwitch = GetProps<typeof Switch> & TBasicUI;

export const TIME_PICKER = "time_picker";
export type TTimePicker = GetProps<typeof TimePicker> & TBasicUI;

export const TIME_PICKER_RANGE = "time_picker_range";
export type TTimePickerRange = GetProps<typeof TimePicker.RangePicker> & TBasicUI;

export const TRANSFER = "transfer";
export type TTransfer = GetProps<typeof Transfer> & TBasicUI;

export const TREE_SELECT = "tree_select";
export type TTreeSelect = GetProps<typeof TreeSelect> & TBasicUI;

export const UPLOAD = "upload";
export type TUpload = GetProps<typeof Upload> & TBasicUI;

export const UPLOAD_DRAGGER = "upload.dragger";
export type TUploadDragger = GetProps<typeof Upload.Dragger> & TBasicUI;

// Custom type for Image Crop Upload as it's not a standard Ant Design component
export const UPLOAD_IMG_CROP = "upload.img_crop";
export type TUploadImgCrop = (GetProps<typeof Upload> & {
    aspect?: number;
    shape?: "rect" | "round";
    grid?: boolean;
    quality?: number;
    fillColor?: string;
}) &
    TBasicUI;

// Data Display
export const AVATAR = "avatar";
export type TAvatar = GetProps<typeof Avatar> & TBasicUI;

export const BADGE = "badge";
export type TBadge = GetProps<typeof Badge> & TBasicUI;

export const BADGE_RIBBON = "badge.ribbon";
export type TBadgeRibbon = GetProps<typeof Badge.Ribbon> & TBasicUI;

export const CALENDAR = "calendar";
export type TCalendar = GetProps<typeof Calendar> & TBasicUI;

export const CARD = "card";
export type TCard = GetProps<typeof Card> & TBasicUI;

export const CARS_GRID = "card.grid";
export type TCardGrid = GetProps<typeof Card.Grid> & TBasicUI;

export const CARS_META = "card.meta";
export type TCardMeta = GetProps<typeof Card.Meta> & TBasicUI;

export const CAROUSEL = "carousel";
export type TCarousel = GetProps<typeof Carousel> & TBasicUI;

export const COLLAPSE = "collapse";
export type TCollapse = GetProps<typeof Collapse> & TBasicUI;

export const DESCRIPTIONS = "descriptions";
export type TDescriptions = GetProps<typeof Descriptions> & TBasicUI;

export const EMPTY = "empty";
export type TEmpty = GetProps<typeof Empty> & TBasicUI;

export const IMAGE = "image";
export type TImage = GetProps<typeof Image> & TBasicUI;

export const IMAGE_PREVIEW = "image.preview";
export type TImagePreview = GetProps<typeof Image.PreviewGroup> & TBasicUI;

export const LIST = "list";
export type TList = GetProps<typeof List> & TBasicUI;

export const POP_OVER = "pop_over";
export type TPopover = GetProps<typeof Popover> & TBasicUI;

export const QRCODE = "qrcode";
export type TQRCode = GetProps<typeof QRCode> & TBasicUI;

export const SEGMENTED = "segmented";
export type TSegmented = GetProps<typeof Segmented> & TBasicUI;

export const STATISTIC = "statistic";
export type TStatistic = GetProps<typeof Statistic> & TBasicUI;

export const STATISTIC_COUNTDOWN = "statistic.countdown";
export type TStatisticCountdown = GetProps<typeof Statistic.Countdown> & TBasicUI;

export const TABLE = "table";
export type TTable = GetProps<typeof Table> & TBasicUI;

export const TABS = "tabs";
export type TTabs = GetProps<typeof Tabs> & TBasicUI;

export const TAG = "tag";
export type TTag = GetProps<typeof Tag> & TBasicUI;

export const TIMELINE = "timeline";
export type TTimeline = GetProps<typeof Timeline> & TBasicUI;

export const TOOLTIP = "tooltip";
export type TTooltip = GetProps<typeof Tooltip> & TBasicUI;

export const TREE = "tree";
export type TTree = GetProps<typeof Tree> & TBasicUI;

export const TOUR = "tour";
export type TTour = GetProps<typeof Tour> & TBasicUI;

// Feedback
export const ALERT = "alert";
export type TAlert = GetProps<typeof Alert> & TBasicUI;

export const DRAWER = "drawer";
export type TDrawer = GetProps<typeof Drawer> & TBasicUI;

export const MODAL = "modal";
export type TModal = GetProps<typeof Modal> & TBasicUI;

export const NOTIFICATION = "notification";
export type TNotification = GetProps<typeof Notification> & TBasicUI;

export const POPCONFIRM = "popconfirm";
export type TPopconfirm = GetProps<typeof Popconfirm> & TBasicUI;

export const PROGRESS = "progress";
export type TProgress = GetProps<typeof Progress> & TBasicUI;

export const RESULT = "result";
export type TResult = GetProps<typeof Result> & TBasicUI;

export const SKELETON = "skeleton";
export type TSkeleton = GetProps<typeof Skeleton> & TBasicUI;

export const SKELETON_AVATAR = "skeleton.avatar";
export type TSkeletonAvatar = GetProps<typeof Skeleton.Avatar> & TBasicUI;

export const SKELETON_BUTTON = "skeleton.button";
export type TSkeletonButton = GetProps<typeof Skeleton.Button> & TBasicUI;

export const SKELETON_INPUT = "skeleton.input";
export type TSkeletonInput = GetProps<typeof Skeleton.Input> & TBasicUI;

export const SKELETON_IMAGE = "skeleton.image";
export type TSkeletonImage = GetProps<typeof Skeleton.Image> & TBasicUI;

export const SKELETON_NODE = "skeleton.node";
export type TSkeletonNode = GetProps<typeof Skeleton.Node> & TBasicUI;

export const SKELETON_TITLE = "skeleton.title";
export type TSkeletonTitle = GetProps<typeof Skeleton> & TBasicUI;

export const SPIN = "spin";
export type TSpin = GetProps<typeof Spin> & TBasicUI;

export const WATERMARK = "watermark";
export type TWatermark = GetProps<typeof Watermark> & TBasicUI;

// Create a comprehensive type for all component types
export type ComponentTypeMap = {
    [BUTTON]: TButton;
    [FLOAT_BUTTON]: TFloatButton;
    [FLOAT_BUTTON_BACK_TOP]: TFloatButtonBackTop;
    [FLOAT_BUTTON_GROUP]: TFloatButtonGroup;
    [TYPOGRAPHY_TITLE]: TTypographyTitle;
    [TYPOGRAPHY_TEXT]: TTypographyText;
    [TYPOGRAPHY_LINK]: TTypographyLink;
    [TYPOGRAPHY_PARAGRAPH]: TTypographyParagraph;
    [DIVIDER]: TDivider;
    [GRID_ROW]: TGridRow;
    [GRID_COL]: TGridCol;
    [FLEX]: TFlex;
    [SPACE]: TSpace;
    [SPACE_COMPACT]: TSpaceCompact;
    [LAYOUT]: TLayout;
    [HEADER]: THeader;
    [SIDER]: TSider;
    [CONTENT]: TContent;
    [FOOTER]: TFooter;
    [ANCHOR]: TAnchor;
    [DROPDOWN]: TDropdown;
    [MENU]: TMenu;
    [STEPS]: TSteps;
    [PAGINATION]: TPagination;
    [BREADCRUMB]: TBreadcrumb;
    [AUTO_COMPLETE]: TAutoComplete;
    [CASCADER]: TCascader;
    [CHECKBOX]: TCheckbox;
    [CHECKBOX_GROUP]: TCheckboxGroup;
    [COLOR_PICKER]: TColorPicker;
    [DATE_PICKER]: TDatePicker;
    [DATE_PICKER_RANGE]: TDatePickerRange;
    [FORM]: TForm;
    [FORM_ITEM]: TFormItem;
    [FROM_LIST]: TFormList;
    [FORM_PROVIDER]: TFormProvider;
    [INPUT]: TInput;
    [INPUT_PASSWORD]: TInputPassword;
    [INPUT_SEARCH]: TInputSearch;
    [INPUT_TEXT_AREA]: TInputTextArea;
    [INPUT_OTP]: TInputOTP;
    [INPUT_GROUP]: TInputGroup;
    [INPUT_NUMBER]: TInputNumber;
    [MENTION]: TMention;
    [RATE]: TRate;
    [RADIO]: TRadio;
    [RADIO_BUTTON]: TRadioButton;
    [RADIO_GROUP]: TRadioGroup;
    [SELECT]: TSelect;
    [SLIDER]: TSlider;
    [SWITCH]: TSwitch;
    [TIME_PICKER]: TTimePicker;
    [TIME_PICKER_RANGE]: TTimePickerRange;
    [TRANSFER]: TTransfer;
    [TREE_SELECT]: TTreeSelect;
    [UPLOAD]: TUpload;
    [UPLOAD_DRAGGER]: TUploadDragger;
    [UPLOAD_IMG_CROP]: TUploadImgCrop;
    [AVATAR]: TAvatar;
    [BADGE]: TBadge;
    [BADGE_RIBBON]: TBadgeRibbon;
    [CALENDAR]: TCalendar;
    [CARD]: TCard;
    [CARS_GRID]: TCardGrid;
    [CARS_META]: TCardMeta;
    [CAROUSEL]: TCarousel;
    [COLLAPSE]: TCollapse;
    [DESCRIPTIONS]: TDescriptions;
    [EMPTY]: TEmpty;
    [IMAGE]: TImage;
    [IMAGE_PREVIEW]: TImagePreview;
    [LIST]: TList;
    [POP_OVER]: TPopover;
    [QRCODE]: TQRCode;
    [SEGMENTED]: TSegmented;
    [STATISTIC]: TStatistic;
    [STATISTIC_COUNTDOWN]: TStatisticCountdown;
    [TABLE]: TTable;
    [TABS]: TTabs;
    [TAG]: TTag;
    [TIMELINE]: TTimeline;
    [TOOLTIP]: TTooltip;
    [TREE]: TTree;
    [TOUR]: TTour;
    [ALERT]: TAlert;
    [DRAWER]: TDrawer;
    [MODAL]: TModal;
    [NOTIFICATION]: TNotification;
    [POPCONFIRM]: TPopconfirm;
    [PROGRESS]: TProgress;
    [RESULT]: TResult;
    [SKELETON]: TSkeleton;
    [SKELETON_AVATAR]: TSkeletonAvatar;
    [SKELETON_BUTTON]: TSkeletonButton;
    [SKELETON_INPUT]: TSkeletonInput;
    [SKELETON_IMAGE]: TSkeletonImage;
    [SKELETON_NODE]: TSkeletonNode;
    [SKELETON_TITLE]: TSkeletonTitle;
    [SPIN]: TSpin;
    [WATERMARK]: TWatermark;
};

// Union type for all QuickUI components
export type TQuickUI =
    | TButton
    | TFloatButton
    | TFloatButtonBackTop
    | TFloatButtonGroup
    | TTypographyTitle
    | TTypographyText
    | TTypographyLink
    | TTypographyParagraph
    | TDivider
    | TGridRow
    | TGridCol
    | TFlex
    | TSpace
    | TSpaceCompact
    | TLayout
    | THeader
    | TSider
    | TContent
    | TFooter
    | TAnchor
    | TDropdown
    | TMenu
    | TSteps
    | TPagination
    | TBreadcrumb
    | TAutoComplete
    | TCascader
    | TCheckbox
    | TCheckboxGroup
    | TColorPicker
    | TDatePicker
    | TDatePickerRange
    | TForm
    | TFormItem
    | TFormList
    | TFormProvider
    | TInput
    | TInputPassword
    | TInputSearch
    | TInputTextArea
    | TInputOTP
    | TInputGroup
    | TInputNumber
    | TMention
    | TRate
    | TRadio
    | TRadioButton
    | TRadioGroup
    | TSelect
    | TSlider
    | TSwitch
    | TTimePicker
    | TTimePickerRange
    | TTransfer
    | TTreeSelect
    | TUpload
    | TUploadDragger
    | TUploadImgCrop
    | TAvatar
    | TBadge
    | TBadgeRibbon
    | TCalendar
    | TCard
    | TCardGrid
    | TCardMeta
    | TCarousel
    | TCollapse
    | TDescriptions
    | TEmpty
    | TImage
    | TImagePreview
    | TList
    | TPopover
    | TQRCode
    | TSegmented
    | TStatistic
    | TStatisticCountdown
    | TTable
    | TTabs
    | TTag
    | TTimeline
    | TTooltip
    | TTree
    | TTour
    | TAlert
    | TDrawer
    | TModal
    | TNotification
    | TPopconfirm
    | TProgress
    | TResult
    | TSkeleton
    | TSkeletonAvatar
    | TSkeletonButton
    | TSkeletonInput
    | TSkeletonImage
    | TSkeletonNode
    | TSkeletonTitle
    | TSpin
    | TWatermark;
