export interface Photo {
  uri: string;
}

export interface NextcloudCredentials {
  server: string;
  username: string;
  password: string;
}

export interface WebDAVFile {
  filename: string;
  mime?: string;
}

export interface Credentials {
  [key: string]: any;
}
