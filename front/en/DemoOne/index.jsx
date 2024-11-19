import formatMessage from "util/formatMessage";
import { memo } from "react";
import {
  AppstoreOutlined,
  LikeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { TruckOutlined } from "component/Icon";
import Image from "component/Image";
import styles from "./index.module.less";

const Advantages = memo(() => (
  <div className={styles.container}>
    {advantages.map(({ title, description, icon, image }, index) => (
      <div key={index} className={styles.card}>
        <div className={styles.image}>
          <Image alt={title} lazyload={false} src={image} />
          <div className={styles.header}>
            {icon}
            <h6 className="text-20 text-white mb-0">{title}</h6>
          </div>
        </div>
        <div className={styles.description}>{description}</div>
      </div>
    ))}
  </div>
));

const advantages = [
  {
    title: formatMessage({
      id: "large_amount_of_goods",
    }),
    description: formatMessage({
      id: "with_buckydrop__you_can_access_all_major_chinese_platforms__taobao_tmall_jd_com_1688__and_even_private_sources_and_white_label_products_",
    }),
    icon: <AppstoreOutlined />,
    image: require("./img/large-quantity-of-goods.jpg"),
  },
  {
    title: formatMessage({
      id: "high_profit__local_prices",
    }),
    description: formatMessage({
      id: "you_can_purchase_at_the_local_cost_price_in_china_and_sell_them_worldwide_with_a_mark_up_at_will__without_buckydrop_earning_a_price_difference_",
    }),
    icon: <LikeOutlined />,
    image: require("./img/good-quality-and-low-price.jpg"),
  },
  {
    title: formatMessage({
      id: "value_added_services",
    }),
    description: formatMessage({
      id: "we_ve_got_you_well_covered_with_a_wide_selection_of_meticulous_value_added_services_from_purchasing_and_warehousing_to_logistics_and_agent_operation_",
    }),
    icon: <HeartOutlined />,
    image: require("./img/featured-services.jpg"),
  },
  {
    title: formatMessage({
      id: "convenient_logistics",
    }),
    description: formatMessage({
      id: "50__logistics_providers_and_100__logistics_lines_work_together_to_help_transfer_your_parcels_to_200__countries_and_regions_around_the_world_",
    }),
    icon: <TruckOutlined />,
    image: require("./img/convenient-logistics.jpg"),
  },
];

export default Advantages;
