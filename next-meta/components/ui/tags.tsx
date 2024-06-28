const createComponent =
  (className = "") =>
  ({ className: propsClassName = "", ...props }) =>
    (
      <div className={className + " " + propsClassName} {...props}>
        {props.children}
      </div>
    );

export const Component = createComponent();
export const Page = createComponent();
export const Flex = createComponent("flex");
export const Grid = createComponent("grid");
export const Relative = createComponent("relative");
export const Absolute = createComponent("absolute");
export const Fixed = createComponent("fixed");
export const Inside = createComponent();
export const Body = createComponent();
export const Item = createComponent();
export const Right = createComponent("");
export const Left = createComponent("");
export const Label = createComponent("");
export const Title = createComponent();
export const Logo = createComponent();
export const SupTitle = createComponent("");
export const SubTitle = createComponent("");
export const Content = createComponent("");
export const Info = createComponent("");
export const Container = createComponent("");
export const Status = createComponent("");
export const Col = createComponent("");
export const Hero = createComponent("");
export const Card = createComponent("");
export const Text = createComponent("");
