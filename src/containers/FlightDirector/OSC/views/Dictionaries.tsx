import React, {useState} from "react";
import {
  useOscDictionariesQuery,
  useOscDictionaryQuery,
} from "generated/graphql";

import {LoadingPlaceholder, ViewContainer} from "./components";

interface MethodType {
  id: string;
  name: string;
  path: string;
  description?: string;
  color?: string;
}
interface DictionaryType {
  id: string;
  name: string;
  methods: MethodType[]
}

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
    {props.name}
  </div>
);

// hack to get around not using a version of Typescript higher than 4.1
interface CustomCSSProperties extends React.CSSProperties {
  "--color": string;
}
interface DictionaryMethodProps {
  method: MethodType;
}
const DictionaryMethod: React.FC<DictionaryMethodProps> = props => {
  const method = props.method;

  const [open, setOpen] = useState<boolean>(false);

  const styles: CustomCSSProperties = {
    "--color": method.color || "#49cc90"
  }

  return (
    <div 
      className="oscDictionaryMethod" 
      data-state={open ? "open" : "closed"} 
      key={method.id}
      style={styles}
      >
      <div className="oscDictionaryMethod_summary" onClick={() => setOpen(!open)}>
        <div className="oscDictionaryMethod_name">{method.name}</div>
        <div className="oscDictionaryMethod_path">{method.path}</div>
      </div>
      <div className="oscDictionaryMethod_details">
        {/* I like to live dangerously sometimes */}
        <div
          className="oscDictionaryMethod_description" 
          dangerouslySetInnerHTML={{__html: method.description ?? ""}}
        ></div>
        <hr/>
      </div>
    </div>
  );
};

interface DictionaryMethodListProps {
  dictionaryId?: string;
}
const DictionaryMethodList: React.FC<DictionaryMethodListProps> = props => {
  const {data: dictionaryData, loading: dictionaryLoading} = useOscDictionaryQuery({
    variables: {
      id: props.dictionaryId ?? ""
    }
  })
  if (dictionaryData?.oscDictionary === undefined) return null;

  const dictionary = dictionaryData.oscDictionary as DictionaryType;
  console.log(dictionary);

  return (
    <>
    {dictionary.methods.map(method =>
      <DictionaryMethod method={method}></DictionaryMethod>
    )}
    {dictionaryLoading && <LoadingPlaceholder/>}
    </>
  )
};

export const Dictionaries: React.FC = () => {
  const {data} = useOscDictionariesQuery();

  const [selectedDictionary, setSelectedDictionary] = useState<
    string | undefined
  >("qlab");

  const dictionaries = (data?.oscDictionaries as DictionaryItemProps[]) || [];
  const dictionaryItems = () => {
    return dictionaries.map(dictionary => (
      <DictionaryItem
        {...dictionary}
        key={dictionary.id}
        selected={selectedDictionary === dictionary.id}
        onClick={() => setSelectedDictionary(dictionary.id)}
      />
    ));
  };

  return (
    <ViewContainer title="Dictionaries">
      <div className="oscDictionaries">
        <div className="oscDictionaryList">{dictionaryItems()}</div>
        <div className="oscDictionaryMethods oscCard">
          <DictionaryMethodList dictionaryId={selectedDictionary!}/>
        </div>
      </div>
    </ViewContainer>
  );
};
