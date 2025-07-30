import { Row, Col } from "antd";
import LanguageDistributionChart from "./languageDistributionChart";
import CoutStudents from "./coutStudents";

const Dashboard = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <CoutStudents />
        <LanguageDistributionChart />
      </Col>
    </Row>
  );
};

export default Dashboard;
