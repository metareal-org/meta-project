import { Flex } from "@/components/ui/tags";

type TokenWidgetProps = {
  imgSrc: string;
  tokenValue: string;
  tokenName: string;
};

const TokenWidget = ({ imgSrc, tokenValue, tokenName }: TokenWidgetProps) => {

  return (
    <Flex className="items-center relative">
      <img src={imgSrc} className="z-10 -mt-2 size-16" />
      <div className="bg-teal-fg/90 rounded-full text-sm flex items-center justify-center pl-10 pr-4  min-w-20 border-2 border-teal -ml-10 h-9">
        {tokenValue} {tokenName}
      </div>
    </Flex>
  );
};

const PortfolioWidget = () => {
  return (
    <>
      <div className="fixed z-20 h-20 items-center flex top-5 right-5">
        <Flex className="gap-2">
          <TokenWidget imgSrc="/assets/images/tokens/meta.png" tokenValue="0" tokenName="Meta" />
          <TokenWidget imgSrc="/assets/images/tokens/cp.webp" tokenValue="0" tokenName="CP" />
        </Flex>
      </div>
    </>
  );
};

export default PortfolioWidget;
