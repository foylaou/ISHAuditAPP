export interface Enterprise {
  id: string;
  name: string;
  child: Company[];
}

export interface Company {
  id: string;
  name: string;
  child: Factory[];
}

export interface Factory {
  id: string;
  name: string;
   // 如果未來需要更多層級可以擴展
}
