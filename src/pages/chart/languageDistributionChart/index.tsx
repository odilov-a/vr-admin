import { useEffect, useState } from "react";
import { Pie } from "@ant-design/charts";
import { Spin, Card } from "antd";
import axios from "axios";
import { useHooks } from "hooks";

const LanguageDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useHooks();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ROOT_API}/statistics/languages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(
          response.data.data.map((item: any) => ({
            type: item.type,
            value: item.count,
          }))
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    label: {
      offset: "-30%",
      content: "{name}\n{percentage}",
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <Card
      title={t("Language Distribution")}
      style={{ width: "100%", marginTop: 20 }}
    >
      {loading ? <Spin /> : <Pie {...config} />}
    </Card>
  );
};

export default LanguageDistributionChart;
