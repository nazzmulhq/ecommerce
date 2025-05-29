import { Carousel, FloatButton, Tree } from "antd";
import { FC } from "react";
import Button from "./General/Button";
import FloatButtonBackTop from "./General/FloatButton/BackTop";
import FloatButtonGroup from "./General/FloatButton/Group";
import TypographyLink from "./General/Typography/Link";
import TypographyParagraph from "./General/Typography/Paragraph";
import TypographyText from "./General/Typography/Text";
import TypographyTitle from "./General/Typography/Title";
import Divider from "./Layouts/Divider";
import Flex from "./Layouts/Flex";
import GridCol from "./Layouts/GridCol";
import GridRow from "./Layouts/GridRow";
import Layout from "./Layouts/Layout";
import Content from "./Layouts/Layout/Content";
import Footer from "./Layouts/Layout/Footer";
import Headers from "./Layouts/Layout/Header";
import Sider from "./Layouts/Layout/Sider";

import Card from "./DataDisplay/Card";
import CardGrid from "./DataDisplay/Card/Grid";
import CardMeta from "./DataDisplay/Card/Meta";
import Collapse from "./DataDisplay/Collapse";
import Descriptions from "./DataDisplay/Descriptions";
import Empty from "./DataDisplay/Empty";
import Image from "./DataDisplay/Image";
import ImagePreviewGroup from "./DataDisplay/Image/PreviewGroup";
import Popover from "./DataDisplay/Popover";
import QRCode from "./DataDisplay/QRCode";
import Segmented from "./DataDisplay/Segmented";
import Statistic from "./DataDisplay/Statistic";
import Countdown from "./DataDisplay/Statistic/Countdown";
import Table from "./DataDisplay/Table";
import Tabs from "./DataDisplay/Tabs";
import Tag from "./DataDisplay/Tag";
import Timeline from "./DataDisplay/Timeline";
import Tooltip from "./DataDisplay/Tooltip";
import Tour from "./DataDisplay/Tour";
import AutoComplete from "./DataEntry/AutoComplete";
import Cascader from "./DataEntry/Cascader";
import Checkbox from "./DataEntry/Checkbox";
import CheckboxGroup from "./DataEntry/Checkbox/CheckboxGroup";
import ColorPicker from "./DataEntry/ColorPicker";
import DatePicker from "./DataEntry/DatePicker";
import RangeDatePicker from "./DataEntry/DatePicker/RangePicker";
import Form from "./DataEntry/Form";
import FormItem from "./DataEntry/Form/FormItem";
import FormList from "./DataEntry/Form/FormList";
import FormProvider from "./DataEntry/Form/FormProvider";
import Input from "./DataEntry/Input";
import InputGroup from "./DataEntry/Input/Group";
import InputOTP from "./DataEntry/Input/OTP";
import InputPassword from "./DataEntry/Input/Password";
import InputSearch from "./DataEntry/Input/Search";
import InputTextArea from "./DataEntry/Input/TextArea";
import InputNumber from "./DataEntry/InputNumber";
import Mentions from "./DataEntry/Mentions";
import Radio from "./DataEntry/Radio";
import RadioButton from "./DataEntry/Radio/Button";
import RadioGroup from "./DataEntry/Radio/Group";
import Rate from "./DataEntry/Rate";
import Select from "./DataEntry/Select";
import Slider from "./DataEntry/Slider";
import Switch from "./DataEntry/Switch";
import TimePicker from "./DataEntry/TimePicker";
import TimeRangePicker from "./DataEntry/TimePicker/Range";
import Transfer from "./DataEntry/Transfer";
import TreeSelect from "./DataEntry/TreeSelect";
import Upload from "./DataEntry/Upload";
import UploadImageDraggable from "./DataEntry/Upload/ImageDragger";
import UploadImgCrop from "./DataEntry/Upload/ImgCrop";
import Alert from "./Feedback/Alert";
import Drawer from "./Feedback/Drawer";
import Modal from "./Feedback/Modal";
import Popconfirm from "./Feedback/Popconfirm";
import Progress from "./Feedback/Progress";
import Result from "./Feedback/Result";
import Skeleton from "./Feedback/Skeleton";
import SkeletonAvatar from "./Feedback/Skeleton/Avatar";
import SkeletonButton from "./Feedback/Skeleton/Button";
import SkeletonImage from "./Feedback/Skeleton/Image";
import SkeletonInput from "./Feedback/Skeleton/Input";
import SkeletonNode from "./Feedback/Skeleton/Node";
import SkeletonTitle from "./Feedback/Skeleton/Title";
import Spin from "./Feedback/Spin";
import Watermark from "./Feedback/Watermark";
import Space from "./Layouts/Space";
import SpaceCompact from "./Layouts/Space/SpaceCompact";
import Anchor from "./Navigation/Anchor";
import Breadcrumb from "./Navigation/Breadcrumb";
import Dropdown from "./Navigation/Dropdown";
import Menu from "./Navigation/Menu";
import Pagination from "./Navigation/Pagination";
import Steps from "./Navigation/Steps";
import {
    ALERT,
    ANCHOR,
    AUTO_COMPLETE,
    BREADCRUMB,
    BUTTON,
    CARD,
    CAROUSEL,
    CARS_GRID,
    CARS_META,
    CASCADER,
    CHECKBOX,
    CHECKBOX_GROUP,
    COLLAPSE,
    COLOR_PICKER,
    CONTENT,
    DATE_PICKER,
    DATE_PICKER_RANGE,
    DESCRIPTIONS,
    DIVIDER,
    DRAWER,
    DROPDOWN,
    EMPTY,
    FLEX,
    FLOAT_BUTTON,
    FLOAT_BUTTON_BACK_TOP,
    FLOAT_BUTTON_GROUP,
    FOOTER,
    FORM,
    FORM_ITEM,
    FORM_PROVIDER,
    FROM_LIST,
    GRID_COL,
    GRID_ROW,
    HEADER,
    IMAGE,
    IMAGE_PREVIEW,
    INPUT,
    INPUT_GROUP,
    INPUT_NUMBER,
    INPUT_OTP,
    INPUT_PASSWORD,
    INPUT_SEARCH,
    INPUT_TEXT_AREA,
    LAYOUT,
    MENTION,
    MENU,
    MODAL,
    PAGINATION,
    POP_OVER,
    POPCONFIRM,
    PROGRESS,
    QRCODE,
    RADIO,
    RADIO_BUTTON,
    RADIO_GROUP,
    RATE,
    RESULT,
    SEGMENTED,
    SELECT,
    SIDER,
    SKELETON,
    SKELETON_AVATAR,
    SKELETON_BUTTON,
    SKELETON_IMAGE,
    SKELETON_INPUT,
    SKELETON_NODE,
    SKELETON_TITLE,
    SLIDER,
    SPACE,
    SPACE_COMPACT,
    SPIN,
    STATISTIC,
    STATISTIC_COUNTDOWN,
    STEPS,
    SWITCH,
    TABLE,
    TABS,
    TAG,
    TIME_PICKER,
    TIME_PICKER_RANGE,
    TIMELINE,
    TOOLTIP,
    TOUR,
    TQuickUI,
    TRANSFER,
    TREE,
    TREE_SELECT,
    TYPOGRAPHY_LINK,
    TYPOGRAPHY_PARAGRAPH,
    TYPOGRAPHY_TEXT,
    TYPOGRAPHY_TITLE,
    UPLOAD,
    UPLOAD_DRAGGER,
    UPLOAD_IMG_CROP,
    WATERMARK,
} from "./type";

export interface IRender {
    components: TQuickUI[];
}

export const renderComponent = (components: TQuickUI[]) => {
    if (components.length === 0) return <Empty ctype="empty" description="No components found" />;
    return components.map(({ ctype, ...item }, index) => {
        const id = index;
        switch (ctype) {
            case BUTTON: {
                // Exclude ctype from props passed to AntD Button
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { ctype: _ctype, ...buttonProps } = item;
                return <Button key={id} {...buttonProps} />;
            }
            case FLOAT_BUTTON:
                return <FloatButton key={id} {...item} />;
            case FLOAT_BUTTON_GROUP:
                return <FloatButtonGroup key={id} {...item} />;
            case FLOAT_BUTTON_BACK_TOP:
                return <FloatButtonBackTop key={id} {...item} />;
            case TYPOGRAPHY_TITLE:
                return <TypographyTitle key={id} {...item} />;
            case TYPOGRAPHY_TEXT:
                return <TypographyText key={id} {...item} />;
            case TYPOGRAPHY_LINK:
                return <TypographyLink key={id} {...item} />;
            case TYPOGRAPHY_PARAGRAPH:
                return <TypographyParagraph key={id} {...item} />;
            case LAYOUT:
                return <Layout key={id} {...item} />;
            case HEADER:
                return <Headers key={id} {...item} />;
            case SIDER:
                return <Sider key={id} {...item} />;
            case CONTENT:
                return <Content key={id} {...item} />;
            case FOOTER:
                return <Footer key={id} {...item} />;
            case DIVIDER:
                return <Divider key={id} {...item} />;
            case FLEX:
                return <Flex key={id} {...item} />;
            case GRID_ROW:
                return <GridRow key={id} {...item} />;
            case GRID_COL:
                return <GridCol key={id} {...item} />;
            case SPACE:
                return <Space key={id} {...item} />;
            case SPACE_COMPACT:
                return <SpaceCompact key={id} {...item} />;
            case ANCHOR:
                return <Anchor key={id} {...item} />;
            case BREADCRUMB:
                return <Breadcrumb key={id} {...item} />;
            case DROPDOWN:
                return <Dropdown key={id} {...item} />;
            case MENU:
                return <Menu key={id} {...item} />;
            case PAGINATION:
                return <Pagination key={id} {...item} />;
            case STEPS:
                return <Steps key={id} {...item} />;
            case AUTO_COMPLETE:
                return <AutoComplete key={id} {...item} />;
            case CASCADER:
                return <Cascader key={id} {...item} />;
            case CHECKBOX:
                return <Checkbox key={id} {...item} />;
            case CHECKBOX_GROUP:
                return <CheckboxGroup key={id} {...item} />;
            case COLOR_PICKER:
                return <ColorPicker key={id} {...item} />;
            case DATE_PICKER:
                return <DatePicker key={id} {...item} />;
            case DATE_PICKER_RANGE:
                return <RangeDatePicker key={id} {...item} />;
            case FORM:
                return <Form key={id} {...item} />;
            case FORM_ITEM:
                return <FormItem key={id} {...item} />;
            case FROM_LIST:
                return <FormList key={id} {...item} />;
            case FORM_PROVIDER:
                return <FormProvider key={id} {...item} />;
            case INPUT:
                return <Input key={id} {...item} />;
            case INPUT_GROUP:
                return <InputGroup key={id} {...item} />;
            case INPUT_PASSWORD:
                return <InputPassword key={id} {...item} />;
            case INPUT_OTP:
                return <InputOTP key={id} {...item} />;
            case INPUT_SEARCH:
                return <InputSearch key={id} {...item} />;
            case INPUT_TEXT_AREA:
                return <InputTextArea key={id} {...item} />;
            case INPUT_NUMBER:
                return <InputNumber key={id} {...item} />;
            case MENTION:
                return <Mentions key={id} {...item} />;
            case RADIO:
                return <Radio key={id} {...item} />;
            case RADIO_BUTTON:
                return <RadioButton key={id} {...item} />;
            case RADIO_GROUP:
                return <RadioGroup key={id} {...item} />;
            case RATE:
                return <Rate key={id} {...item} />;
            case SELECT:
                return <Select key={id} {...item} />;
            case SLIDER:
                return <Slider key={id} {...item} />;
            case SWITCH:
                return <Switch key={id} {...item} />;
            case TIME_PICKER:
                return <TimePicker key={id} {...item} />;
            case TIME_PICKER_RANGE:
                return <TimeRangePicker key={id} {...item} />;
            case TRANSFER:
                return <Transfer key={id} {...item} />;
            case TREE_SELECT:
                return <TreeSelect key={id} {...item} />;
            case UPLOAD:
                return <Upload key={id} {...item} />;
            case UPLOAD_DRAGGER:
                return <UploadImageDraggable key={id} {...item} />;
            case UPLOAD_IMG_CROP:
                return <UploadImgCrop key={id} {...item} />;
            case CARD:
                return <Card key={id} {...item} />;
            case CARS_GRID:
                return <CardGrid key={id} {...item} />;
            case CARS_META:
                return <CardMeta key={id} {...item} />;
            case CAROUSEL:
                return <Carousel key={id} {...item} />;
            case COLLAPSE:
                return <Collapse key={id} {...item} />;
            case DESCRIPTIONS:
                return <Descriptions key={id} {...item} />;
            case EMPTY:
                return <Empty key={id} {...item} />;
            case IMAGE:
                return <Image key={id} {...item} />;
            case IMAGE_PREVIEW:
                return <ImagePreviewGroup key={id} {...item} />;
            case POP_OVER:
                return <Popover key={id} {...item} />;
            case QRCODE:
                return <QRCode key={id} {...item} />;
            case SEGMENTED:
                return <Segmented key={id} {...item} />;
            case STATISTIC:
                return <Statistic key={id} {...item} />;
            case STATISTIC_COUNTDOWN:
                return <Countdown key={id} {...item} />;
            case TABLE:
                return <Table key={id} {...item} />;
            case TABS:
                return <Tabs key={id} {...item} />;
            case TAG:
                return <Tag key={id} {...item} />;
            case TIMELINE:
                return <Timeline key={id} {...item} />;
            case TOOLTIP:
                return <Tooltip key={id} {...item} />;
            case TOUR:
                return <Tour key={id} {...item} />;
            case TREE:
                return <Tree key={id} {...item} />;
            case ALERT:
                return <Alert key={id} {...item} />;
            case DRAWER:
                return <Drawer key={id} {...item} />;
            case MODAL:
                return <Modal key={id} {...item} />;
            case POPCONFIRM:
                return <Popconfirm key={id} {...item} />;
            case PROGRESS:
                return <Progress key={id} {...item} />;
            case RESULT:
                return <Result key={id} {...item} />;
            case SKELETON:
                return <Skeleton key={id} {...item} />;
            case SKELETON_AVATAR:
                return <SkeletonAvatar key={id} {...item} />;
            case SKELETON_BUTTON:
                return <SkeletonButton key={id} {...item} />;
            case SKELETON_IMAGE:
                return <SkeletonImage key={id} {...item} />;
            case SKELETON_INPUT:
                return <SkeletonInput key={id} {...item} />;
            case SKELETON_NODE:
                return <SkeletonNode key={id} {...item} />;
            case SKELETON_TITLE:
                return <SkeletonTitle key={id} {...item} />;
            case SPIN:
                return <Spin key={id} {...item} />;
            case WATERMARK:
                return <Watermark key={id} {...item} />;
            default:
                return (
                    <Empty
                        ctype="empty"
                        props={{
                            description: `Component not found!`,
                        }}
                    />
                );
        }
    });
};

const Render: FC<IRender> = ({ components }) => {
    const render = renderComponent(components);
    return <>{render}</>;
};

export default Render;
