import { useAccount } from "@/hooks/useAccount";
import { useSublicGroups } from "@/hooks/useSublicGroups";
import { Button, List, Space, Spin, Typography } from "antd";

export function MediaList() {
  const { address } = useAccount();

  const { data, isLoading } = useSublicGroups(address);

  if (isLoading) {
    return (
      <Spin size="large" tip="Loading your subscriptions...">
        <div />
      </Spin>
    );
  }

  return (
    <Space direction="vertical" className="w-full">
      {data?.find((g) => g.type === "authors") && (
        <>
          <Typography.Title level={4} className="mt-10">
            You can write to
          </Typography.Title>
          <List
            dataSource={data?.filter((g) => g.type === "authors")}
            renderItem={(group, i) => (
              <List.Item key={i}>
                <Space>
                  <Typography.Text strong>{group.mediaName} </Typography.Text>
                  <Button>Create article</Button>
                </Space>
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
              <Space>
                <Typography.Text strong>{group.mediaName} </Typography.Text>
                <Button>Read</Button>
              </Space>
            </List.Item>
          )}
        />
      </>
    </Space>
  );
}
