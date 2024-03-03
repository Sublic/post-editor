import { useAccount } from "@/hooks/useAccount";
import { useSublicGroups } from "@/hooks/useSublicGroups";
import { Button, Col, List, Row, Space, Spin, Typography } from "antd";

interface MediaListProps {
  write: (mediaId: string) => void;
  read: (mediaId: string) => void;
}

export function MediaList({ write, read }: MediaListProps) {
  const { address } = useAccount();

  const { data, isLoading } = useSublicGroups(address);

  if (isLoading) {
    return (
      <Spin size="large" tip="Loading your subscriptions...">
        <div className="text-center" />
      </Spin>
    );
  }

  return (
    <Space
      direction="vertical"
      className="w-full"
      classNames={{ item: "w-full" }}
      align="center"
    >
      {data?.find((g) => g.type === "authors") && (
        <>
          <Typography.Title level={4} className="mt-10">
            You can write to
          </Typography.Title>
          <List
            dataSource={data?.filter((g) => g.type === "authors")}
            renderItem={(group, i) => (
              <List.Item key={i}>
                <Row className="w-full">
                  <Col span={6} offset={6}>
                    <Typography.Text strong>{group.mediaName} </Typography.Text>
                  </Col>
                  <Col span={6} offset={2}>
                    <Button onClick={() => write(group.mediaId)}>
                      Create article
                    </Button>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </>
      )}
      <>
        <Typography.Title level={4} className="mt-10">
          You can read
        </Typography.Title>
        <List
          dataSource={data || []}
          renderItem={(group, i) => (
            <List.Item key={i}>
              <Row className="w-full">
                <Col span={6} offset={6}>
                  <Typography.Text strong>{group.mediaName} </Typography.Text>
                </Col>
                <Col span={6} offset={2}>
                  <Button onClick={() => read(group.mediaId)}>Read</Button>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </>
    </Space>
  );
}
