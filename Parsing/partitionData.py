import os
import json
from unstructured_ingest.v2.pipeline.pipeline import Pipeline
from unstructured_ingest.v2.interfaces import ProcessorConfig
from unstructured_ingest.v2.processes.connectors.local import (
    LocalIndexerConfig,
    LocalDownloaderConfig,
    LocalConnectionConfig,
    LocalUploaderConfig
)
from unstructured_ingest.v2.processes.partitioner import PartitionerConfig

from dotenv import load_dotenv

load_dotenv()

def generate_json_from_local(
        input_path: str,
        output_dir: str,
        parition_by_api: bool = False,
        api_key: str = None,
        partition_endpoint: str = None,
        split_pdf_page: bool = True,
        split_pdf_allow_failed: bool = True,
        split_pdf_concurrency_level: int = 15
    ):
    Pipeline.from_configs(
        context=ProcessorConfig(),
        indexer_config=LocalIndexerConfig(input_path=input_path),
        downloader_config=LocalDownloaderConfig(),
        source_connection_config=LocalConnectionConfig(),
        partitioner_config=PartitionerConfig(
            partition_by_api=parition_by_api,
            api_key=api_key,
            partition_endpoint=partition_endpoint,
            strategy="hi_res",
            additional_partition_args={
                "split_pdf_page": split_pdf_page,
                "split_pdf_allow_failed": split_pdf_allow_failed,
                "split_pdf_concurrency_level": split_pdf_concurrency_level
            }
        ),
        uploader_config=LocalUploaderConfig(output_dir=output_dir)
    ).run()


def process_json_file(json_file_path):
    with open(json_file_path, 'r') as file:
        elements = json.load(file)
    
    documents = []
    i = 0
    for element in elements:
        documents.append({
            "id" : f"{i+1}",
            "page_content": element['text'], 
            "metadata": {
                "filetype": element['metadata']['filetype'],
                "languages": element['metadata']['languages'],
                "page_number": element['metadata']['page_number'],
                "filename": element['metadata']['filename'],
                "data_source": element['metadata']['data_source']
            }
        })
    
    return documents

