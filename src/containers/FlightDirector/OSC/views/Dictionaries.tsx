import React, {useState} from "react";
import {CardBody, CardTitle, CardSubtitle} from "reactstrap";
import {useOscDictionariesSubscription} from "generated/graphql";

import {ViewContainer} from "./components";

interface DictionaryItemProps {
  id?: string;
  name?: string;
  description?: string;

  selected: boolean;
  onClick: () => void;
}
const DictionaryItem: React.FC<DictionaryItemProps> = props => (
  <div
    className={
      "oscDictionaryItem oscCard" + (props.selected ? " selected" : "")
    }
    key={props.id}
    onClick={props.onClick}
  >
    <CardBody>
      <CardTitle tag="h4">{props.name}</CardTitle>
      <CardSubtitle className="mb-2 text-muted" tag="h5">
        {props.description}
      </CardSubtitle>
    </CardBody>
  </div>
);

interface DictionaryMethodProps {}
const DictionaryMethod: React.FC<DictionaryMethodProps> = props => {
  return <div className="oscDictionaryMethod"></div>;
};

interface DictionaryMethodListProps {
  dictionaryId?: string;
}
const DictionaryMethodList: React.FC<DictionaryMethodListProps> = props => {
  const dictionaryMethods = () => {
    return [
      <DictionaryMethod />,
      <DictionaryMethod />,
      <DictionaryMethod />,
      <DictionaryMethod />,
      <DictionaryMethod />,
    ];
  };

  return (
    <div className="oscDictionaryMethods oscCard">{dictionaryMethods()}</div>
  );
};

export const Dictionaries: React.FC = () => {
  const {data, loading} = useOscDictionariesSubscription();

  const [selectedDictionary, setSelectedDictionary] = useState<
    string | undefined
  >();

  const dictionaries = (data?.oscDictionaries as DictionaryItemProps[]) || [];
  const dictionaryItems = () => {
    return dictionaries.map(dictionary => (
      <DictionaryItem
        {...dictionary}
        selected={selectedDictionary === dictionary.id}
        onClick={() => setSelectedDictionary(dictionary.id)}
      />
    ));
  };

  return (
    <ViewContainer title="Dictionaries">
      <div className="oscDictionaries">
        <div className="oscDictionaryList">{dictionaryItems()}</div>
        <DictionaryMethodList dictionaryId={selectedDictionary} />
      </div>
    </ViewContainer>
  );
};
