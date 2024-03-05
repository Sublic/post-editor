"use client";

import { Space, Typography } from "antd";
import Image from "next/image";

export default function Page() {
  return (
    <Space direction="vertical" className="w-full" align="center">
      <Typography.Title level={3}>Sublic Media</Typography.Title>
      <Typography.Paragraph>
        Sublic is Decentralized Media platform. Feel free to create your blog.
        Create the content. We will do the rest. Create or follow blogs. Create
        your own.
      </Typography.Paragraph>

      <Typography.Title level={4} className="mt-5">
        Greenfield powered
      </Typography.Title>
      <Typography.Paragraph>
        Your blog will be hosted decentralised way in the Greenfield platform.
        Battle-tested web3 storage solution developed by Binance Labs.
      </Typography.Paragraph>

      <Typography.Title level={4} className="mt-5">
        BNB integrated
      </Typography.Title>
      <Typography.Paragraph>
        Pay for your blog with BNB coins in your favorite BSC chain. Use our
        contract to create required resources with Greenfield crosschain techs
        and EVM security
      </Typography.Paragraph>

      <Typography.Title level={4} className="mt-5">
        Monetize your knowledge with THENA
      </Typography.Title>
      <Image src="/ThenaLogo.png" alt="thena-logo" width={360} height={120} />
      <Typography.Paragraph>
        Your blog will be gated with greenfield permissions system. Your
        followers buys the access with unique media-token. All Liquidity works
        is ours
      </Typography.Paragraph>
      <Typography.Title level={4} className="mt-5">
        Collect the SUBLIC token
      </Typography.Title>
      <Typography.Paragraph>
        SUBLIC token is the utility relay token for any other media-tokens.
        Anyone who wants to follow blog have to buy the SUBLIC and move it price
        higher
      </Typography.Paragraph>
    </Space>
  );
}
